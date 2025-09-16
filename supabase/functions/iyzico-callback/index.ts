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

    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // iyzico API configuration
    const IYZICO_API_KEY = Deno.env.get('IYZICO_API_KEY')
    const IYZICO_SECRET_KEY = Deno.env.get('IYZICO_SECRET_KEY')
    const IYZICO_BASE_URL = 'https://api.iyzipay.com' // Production URL

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

    // Prepare checkout form result request
    const request = {
      locale: 'tr',
      token: token
    }

    // Create signature
    const authorization = await createSignature(request)

    // Check payment result from iyzico
    const response = await fetch(`${IYZICO_BASE_URL}/payment/iyzipos/checkoutform/auth/ecom/detail`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authorization
      },
      body: JSON.stringify(request)
    })

    const result = await response.json()

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Get payment session from database
      const { data: paymentSession } = await supabaseClient
        .from('payment_sessions')
        .select('*')
        .eq('token', token)
        .single()

      if (!paymentSession) {
        return new Response(
          JSON.stringify({ error: 'Payment session not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update payment session status
      await supabaseClient
        .from('payment_sessions')
        .update({
          status: 'completed',
          payment_id: result.paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('token', token)

      // Add credits to user account
      const totalCredits = paymentSession.credits + paymentSession.bonus_credits
      
      await supabaseClient
        .from('profiles')
        .update({
          credits: supabaseClient.rpc('increment_credits', { 
            user_id: paymentSession.user_id, 
            amount: totalCredits 
          })
        })
        .eq('id', paymentSession.user_id)

      // Record credit transaction
      await supabaseClient
        .from('credit_transactions')
        .insert({
          user_id: paymentSession.user_id,
          amount: totalCredits,
          type: 'purchase',
          description: `${paymentSession.package_id} paketi satın alındı`,
          payment_id: result.paymentId
        })

      return new Response(
        JSON.stringify({
          success: true,
          paymentStatus: 'SUCCESS',
          credits: totalCredits,
          message: 'Ödeme başarılı, krediler hesabınıza eklendi'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Update payment session status to failed
      await supabaseClient
        .from('payment_sessions')
        .update({
          status: 'failed',
          error_message: result.errorMessage || 'Payment failed',
          updated_at: new Date().toISOString()
        })
        .eq('token', token)

      return new Response(
        JSON.stringify({
          success: false,
          error: result.errorMessage || 'Payment failed'
        }),
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