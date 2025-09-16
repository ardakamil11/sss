import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { packageId, conversationId } = await req.json()

    // Get package details
    const packages = {
      'starter': { 
        name: 'Başlangıç Paketi', 
        price: '270.00', 
        credits: 160, 
        bonusCredits: 0 
      },
      'growth': { 
        name: 'Büyüme Paketi', 
        price: '810.00', 
        credits: 480, 
        bonusCredits: 40 
      },
      'pro': { 
        name: 'Pro Paketi', 
        price: '2700.00', 
        credits: 1600, 
        bonusCredits: 300 
      }
    }

    const selectedPackage = packages[packageId as keyof typeof packages]
    if (!selectedPackage) {
      return new Response(
        JSON.stringify({ error: 'Invalid package' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // iyzico API configuration
    const IYZICO_API_KEY = Deno.env.get('IYZICO_API_KEY')
    const IYZICO_SECRET_KEY = Deno.env.get('IYZICO_SECRET_KEY')
    const IYZICO_BASE_URL = 'https://api.iyzipay.com' // Production URL, use 'https://sandbox-api.iyzipay.com' for test

    if (!IYZICO_API_KEY || !IYZICO_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'iyzico credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate random string for request
    const generateRandomString = (length: number) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    // Create HMAC SHA256 signature
    const createSignature = async (request: any) => {
      const randomString = generateRandomString(8)
      const requestString = JSON.stringify(request)
      
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(IYZICO_SECRET_KEY),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      
      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(randomString + requestString)
      )
      
      const hashArray = Array.from(new Uint8Array(signature))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      return `IYZWS ${IYZICO_API_KEY}:${randomString}:${hashHex}`
    }

    // Get user profile for customer info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    // Prepare iyzico checkout form request
    const request = {
      locale: 'tr',
      conversationId: conversationId || `conv_${user.id}_${Date.now()}`,
      price: selectedPackage.price,
      paidPrice: selectedPackage.price,
      currency: 'TRY',
      basketId: `basket_${packageId}_${Date.now()}`,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${req.headers.get('origin')}/payment-success`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: user.id,
        name: profile?.full_name?.split(' ')[0] || 'Ad',
        surname: profile?.full_name?.split(' ').slice(1).join(' ') || 'Soyad',
        gsmNumber: '+905350000000',
        email: user.email,
        identityNumber: '74300864791',
        lastLoginDate: new Date().toISOString().slice(0, 19) + ' +0300',
        registrationDate: new Date().toISOString().slice(0, 19) + ' +0300',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        ip: req.headers.get('x-forwarded-for') || '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: profile?.full_name || 'Ad Soyad',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      billingAddress: {
        contactName: profile?.full_name || 'Ad Soyad',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        zipCode: '34732'
      },
      basketItems: [
        {
          id: packageId,
          name: selectedPackage.name,
          category1: 'Kredi Paketi',
          itemType: 'VIRTUAL',
          price: selectedPackage.price
        }
      ]
    }

    // Create signature
    const authorization = await createSignature(request)

    // Make request to iyzico
    const response = await fetch(`${IYZICO_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authorization
      },
      body: JSON.stringify(request)
    })

    const result = await response.json()

    if (result.status === 'success') {
      // Store payment session in database
      await supabaseClient
        .from('payment_sessions')
        .insert({
          user_id: user.id,
          package_id: packageId,
          conversation_id: request.conversationId,
          token: result.token,
          payment_page_url: result.paymentPageUrl,
          credits: selectedPackage.credits,
          bonus_credits: selectedPackage.bonusCredits,
          amount: selectedPackage.price,
          status: 'pending'
        })

      return new Response(
        JSON.stringify({
          success: true,
          checkoutFormUrl: result.checkoutFormContent,
          token: result.token
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: result.errorMessage || 'Payment initialization failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})