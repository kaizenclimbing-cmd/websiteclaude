-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  subject text NOT NULL,
  html_body text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read templates"
  ON public.email_templates FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update templates"
  ON public.email_templates FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Auto-update updated_at on save
CREATE OR REPLACE FUNCTION public.update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_email_templates_updated_at();

-- ── Seed data ────────────────────────────────────────────────────────────────
-- Tokens: {{firstName}} {{lastName}} {{email}} {{firstName_upper}}
--         {{interests_block}} {{interests_badges}} {{message_block}}
--         {{bookingUrl}} {{reason_block}}

INSERT INTO public.email_templates (template_id, name, description, subject, html_body) VALUES

('contact-confirmation',
 'Contact Form Confirmation',
 'Sent to someone who submits the contact form.',
 'We''ve received your enquiry — Kaizen Climbing Coaching',
 $contact_confirm$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thanks for reaching out — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:32px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
              <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:40px;">
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">MESSAGE</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED!</p>
              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey {{firstName}}, thanks for your enquiry. We've received it and will be in touch shortly.
              </p>
              {{interests_block}}
              <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                In the meantime, if you'd like to start the process, you can fill out a form so I can get to know a little more about you and your climbing — or see more details about the training.
              </p>
              <a href="https://kaizenclimbing.com/consultation"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-right:12px;">
                FILL OUT THE FORM
              </a>
              <a href="https://kaizenclimbing.com/plans"
                 style="display:inline-block;background-color:#1A1A1A;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-top:12px;">
                SEE TRAINING DETAILS
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this email because you submitted an enquiry via kaizenclimbing.com.<br />
                Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>$contact_confirm$),

('consultation-client',
 'Consultation Form Confirmation (Client)',
 'Sent to a client after they complete the consultation form.',
 'Thanks for your consultation form — Kaizen Climbing Coaching',
 $consult_client$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Consultation received — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:32px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
              <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:40px;">
              <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">CONSULTATION</p>
              <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">RECEIVED!</p>
              <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
                Hey {{firstName}}, thanks for completing your consultation form. We'll review everything and be in touch with you <strong>within 72 hours</strong>.
              </p>
              <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">
                Here's what happens next:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">01 &nbsp;</strong>
                      Consultation reviewed — we'll reply within 72 hours
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.1);">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">02 &nbsp;</strong>
                      Complete payment — a payment link will be sent to you
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:#1A1A1A;">
                      <strong style="font-family:'Arial Black',sans-serif;color:#5C5435;">03 &nbsp;</strong>
                      Book your onboarding call — link sent after payment confirmed
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;line-height:1.6;">
                In the meantime, feel free to reach out with any questions.
              </p>
              <a href="mailto:admin@kaizenclimbing.co.uk"
                 style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;">
                GET IN TOUCH
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:24px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
                You're receiving this email because you submitted a consultation via kaizenclimbing.com.<br />
                Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>$consult_client$),

('consultation-admin',
 'Consultation Form — Admin Notification',
 'Sent internally when a new consultation form is submitted.',
 'New consultation submission — {{firstName}} {{lastName}}',
 $consult_admin$<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>New consultation — {{firstName}} {{lastName}}</title></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:28px 40px;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:20px;font-weight:900;color:#FFC93C;text-transform:uppercase;">NEW CONSULTATION SUBMISSION</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#FFC93C;padding:32px 40px;">
              <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:16px;color:#1A1A1A;">
                <strong>{{firstName}} {{lastName}}</strong> has submitted a consultation form.
              </p>
              <p style="margin:0 0 8px 0;font-family:'Inter',sans-serif;font-size:14px;color:#1A1A1A;">
                Email: <a href="mailto:{{email}}" style="color:#5C5435;">{{email}}</a>
              </p>
              <a href="https://kaizenclimbing.com/admin"
                 style="display:inline-block;margin-top:20px;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:12px 24px;">
                VIEW IN DASHBOARD
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:20px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);">
                Kaizen Climbing Coaching admin notification
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>$consult_admin$),

('admin-notification',
 'Contact Form — Admin Notification',
 'Sent internally when a contact form enquiry is submitted.',
 'New enquiry — {{firstName}} {{lastName}}',
 $admin_notif$<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Enquiry — Kaizen Climbing Coaching</title>
</head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="background-color:#5C5435;padding:28px 40px;border-bottom:3px solid #FFC93C;">
              <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:11px;font-weight:900;letter-spacing:0.2em;color:#FFC93C;text-transform:uppercase;">KAIZEN CLIMBING COACHING</p>
              <p style="margin:8px 0 0 0;font-family:'Arial Black',sans-serif;font-size:22px;font-weight:900;letter-spacing:0.05em;color:#ffffff;text-transform:uppercase;line-height:1;">NEW ENQUIRY</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#2a2a2a;padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 24px 0;">
                    <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">From</p>
                    <p style="margin:0 0 2px 0;font-family:'Arial Black',sans-serif;font-size:20px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.03em;">{{firstName}} {{lastName}}</p>
                    <a href="mailto:{{email}}" style="font-family:'Inter',sans-serif;font-size:14px;color:#FFC93C;text-decoration:none;">{{email}}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 24px 0;border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
                    <p style="margin:0 0 10px 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">Interested In</p>
                    <div>{{interests_badges}}</div>
                  </td>
                </tr>
                {{message_block}}
                <tr>
                  <td style="padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);">
                    <a href="mailto:{{email}}?subject=Re: Your Kaizen Climbing Coaching Enquiry"
                       style="display:inline-block;background-color:#FFC93C;color:#1A1A1A;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:14px 28px;margin-right:12px;">
                      REPLY TO {{firstName_upper}}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#4A442B;padding:20px 40px;">
              <p style="margin:0;font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,0.35);line-height:1.6;">
                This notification was sent because someone submitted the contact form at kaizenclimbing.com.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>$admin_notif$),

('accept-application',
 'Application Accepted',
 'Sent to an applicant when their application is accepted.',
 'You''re in — Kaizen Climbing Coaching',
 $accept_app$<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#5C5435;padding:32px 40px;">
            <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#FFC93C;padding:40px;">
            <p style="margin:0 0 4px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">YOU'RE</p>
            <p style="margin:0 0 24px 0;font-family:'Arial Black',sans-serif;font-size:32px;font-weight:900;letter-spacing:0.03em;color:#1A1A1A;text-transform:uppercase;line-height:1;">ACCEPTED.</p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              Hey {{firstName}} — I've reviewed your application and I'd love to work with you.
            </p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              The next step is payment. Log in to your dashboard to complete your payment and get everything set up.
            </p>
            <p style="margin:0 0 28px 0;font-family:'Inter',sans-serif;font-size:15px;color:#1A1A1A;line-height:1.6;">
              Once payment is confirmed, we'll schedule your onboarding call and I'll start building your plan.
            </p>
            <a href="{{dashboardUrl}}"
               style="display:inline-block;background-color:#5C5435;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:16px 32px;">
              GO TO YOUR DASHBOARD →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2a2a2a;padding:24px 40px;">
            <p style="margin:0 0 12px 0;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#FFC93C;">What happens next</p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">1. Complete payment via your dashboard (£600 in full or 3 × £200)</p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">2. Once payment is confirmed, we'll schedule your onboarding call</p>
            <p style="margin:0 0 6px 0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">3. We map out your training plan together</p>
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">4. Coaching begins</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#4A442B;padding:24px 40px;">
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
              Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>$accept_app$),

('decline-application',
 'Application Declined',
 'Sent to an applicant when their application is not taken forward.',
 'Your Kaizen application — Kaizen Climbing Coaching',
 $decline_app$<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#1A1A1A;font-family:'Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1A1A1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background-color:#5C5435;padding:32px 40px;">
            <p style="margin:0;font-family:'Arial Black',sans-serif;font-size:28px;font-weight:900;letter-spacing:0.05em;color:#FFC93C;text-transform:uppercase;">KAIZEN</p>
            <p style="margin:4px 0 0 0;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:rgba(255,255,255,0.5);">Climbing Coaching</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#2a2a2a;padding:40px;">
            <p style="margin:0 0 20px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">Hey {{firstName}},</p>
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              Thanks for applying for the Kaizen Plan — I appreciate you taking the time and being open about your climbing.
            </p>
            {{reason_block}}
            <p style="margin:0 0 16px 0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
              That said, I don't want this to be the end of things. If your situation changes — goals, time, training — please don't hesitate to apply again. And in the meantime, the Training Tips section of the site is there for you.
            </p>
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">Keep climbing — Buster</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#5C5435;padding:24px 40px;text-align:center;">
            <a href="https://kaizenclimbing.co.uk/training-tips"
               style="display:inline-block;color:#FFC93C;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;">
              BROWSE TRAINING TIPS →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#4A442B;padding:24px 40px;">
            <p style="margin:0;font-family:'Inter',sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;">
              Questions? Reply to this email or contact us at <a href="mailto:admin@kaizenclimbing.co.uk" style="color:#FFC93C;text-decoration:none;">admin@kaizenclimbing.co.uk</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>$decline_app$)

ON CONFLICT (template_id) DO NOTHING;
