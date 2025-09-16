-- Update default credits for new users to 10
ALTER TABLE public.user_profiles ALTER COLUMN credits SET DEFAULT 10;

-- Update the trigger function to give 10 credits instead of 100
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, credits)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', 10);
  
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (NEW.id, 10, 'bonus', 'Hoş geldin bonusu - 10 ücretsiz kredi!');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;