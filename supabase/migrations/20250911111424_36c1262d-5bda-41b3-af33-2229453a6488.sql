-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.increment_credits(user_id_param UUID, amount_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  UPDATE public.profiles 
  SET credits = credits + amount_param,
      updated_at = now()
  WHERE id = user_id_param
  RETURNING credits INTO new_credits;
  
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;