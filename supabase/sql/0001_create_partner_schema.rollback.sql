-- Rollback for 0001_create_partner_schema.sql. Paste into the Supabase SQL
-- Editor manually if this needs to be undone -- not run automatically.

DROP FUNCTION IF EXISTS public.record_line_call_result(uuid, boolean, text);
DROP FUNCTION IF EXISTS public.claim_due_line_calls(int);
DROP FUNCTION IF EXISTS public.submit_partner_application(uuid, text, text, text, text, text);

DROP TRIGGER IF EXISTS relationships_after_status_update ON thunder_partner.relationships;
DROP TRIGGER IF EXISTS relationships_before_write ON thunder_partner.relationships;
DROP TRIGGER IF EXISTS applications_after_status_update ON thunder_partner.applications;
DROP TRIGGER IF EXISTS applications_after_insert ON thunder_partner.applications;
DROP TRIGGER IF EXISTS applications_before_write ON thunder_partner.applications;

DROP FUNCTION IF EXISTS thunder_partner.relationships_after_status_update();
DROP FUNCTION IF EXISTS thunder_partner.relationships_before_write();
DROP FUNCTION IF EXISTS thunder_partner.applications_after_write();
DROP FUNCTION IF EXISTS thunder_partner.applications_before_write();

DROP TABLE IF EXISTS thunder_partner.outbound_line_calls;
DROP TABLE IF EXISTS thunder_partner.relationships;
DROP TABLE IF EXISTS thunder_partner.applications;

DROP SCHEMA IF EXISTS thunder_partner;
