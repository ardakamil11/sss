-- Update the handle_new_user function to give 5 credits instead of 10
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, credits)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', 5);
  
  INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description)
  VALUES (NEW.id, 5, 'bonus', 'Hoş geldin bonusu - 5 ücretsiz kredi!');
  
  RETURN NEW;
END;
$function$;