"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { submitContact } from "@/app/[locale]/actions";
import { practice } from "@/content/practice";
import { Link } from "@/i18n/navigation";
import type { ContactState } from "@/lib/contact";
import { contactFields, contactTopics, validateContact, type ContactErrors } from "@/lib/contactSchema";

const initial: ContactState = { status: "idle" };
const noop = () => () => {};
const errorKey = { name: "errName", email: "errEmail", phone: "errPhone", topic: "errTopic", message: "errMsg", consent: "errOk" } as const;

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState(submitContact, initial);
  // Browser-side errors from the last submit attempt; cleared once a valid form goes to the server.
  const [clientErrors, setClientErrors] = useState<ContactErrors | null>(null);
  const errors = clientErrors ?? state.errors ?? {};
  const form = useRef<HTMLFormElement>(null);
  const elapsed = useRef<HTMLInputElement>(null);
  const shownAt = useRef(0);
  const v = state.values ?? {};
  // false in the static HTML: without JavaScript the form cannot send, so the button stays off.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  // When the form appeared; the server treats near-instant submissions as bots.
  useEffect(() => {
    shownAt.current = performance.now();
  }, []);

  const focusFirst = (errs: ContactErrors) => {
    const first = contactFields.find((f) => errs[f]);
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  // Server-side rejections (rare: the browser checks the same rules first).
  useEffect(() => {
    if (state.status === "invalid" && state.errors) focusFirst(state.errors);
  }, [state]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (elapsed.current) elapsed.current.value = String(Math.round(performance.now() - shownAt.current));
    const r = validateContact(new FormData(e.currentTarget));
    if (r.success) return setClientErrors(null);
    e.preventDefault();
    setClientErrors(r.errors);
    focusFirst(r.errors);
  };

  const err = (f: keyof typeof errorKey) =>
    errors[f] ? <p className="field-error" id={`cf-${f}-err`}>{t(errorKey[f])}</p> : null;
  const aria = (f: keyof typeof errorKey, extra?: string) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": [extra, errors[f] ? `cf-${f}-err` : null].filter(Boolean).join(" ") || undefined,
  });

  const status =
    pending ? t("sending")
    : state.status === "ok" ? t("done")
    : state.status === "rate" ? t("errRate")
    : state.status === "error" ? <>{t("errSend")} <a className="ltr" href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a></>
    : null;

  // key: remount after a failed attempt so the fields show the values the server sent back.
  return (
    <form
      key={state.values ? JSON.stringify(state.values) : "blank"}
      ref={form} className="cf" noValidate aria-labelledby="cf-h" action={action} onSubmit={onSubmit}
    >
      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">{t("name")}</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={100} defaultValue={v.name} {...aria("name")} />
          {err("name")}
        </div>
        <div className="cf-field">
          <label htmlFor="cf-email">{t("email")}</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required maxLength={200} dir="ltr" defaultValue={v.email} {...aria("email")} />
          {err("email")}
        </div>
      </div>
      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-phone">{t("phone")} <span className="opt">{t("optional")}</span></label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} dir="ltr" defaultValue={v.phone} {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="cf-field">
          <label htmlFor="cf-topic">{t("topic")}</label>
          <select id="cf-topic" name="topic" defaultValue={v.topic ?? contactTopics[0]} {...aria("topic")}>
            {contactTopics.map((k) => <option key={k} value={k}>{t(`topics.${k}`)}</option>)}
          </select>
          {err("topic")}
        </div>
      </div>
      <div className="cf-field">
        <label htmlFor="cf-message">{t("message")}</label>
        <textarea id="cf-message" name="message" rows={5} maxLength={2000} required defaultValue={v.message} {...aria("message", "cf-msg-hint")} />
        <p className="cf-hint" id="cf-msg-hint">{t("messageHint")}</p>
        {err("message")}
      </div>
      <div className="cf-consent">
        <input id="cf-consent" name="consent" type="checkbox" required {...aria("consent")} />
        <label htmlFor="cf-consent">
          {t("consent")} <Link href="/datenschutz">{t("privacy")}</Link>.
        </label>
      </div>
      {err("consent")}
      {/* Spam traps: hidden from people and assistive technology. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={elapsed} type="hidden" name="elapsed" />
      <button className="btn btn-primary" type="submit" disabled={pending || !hydrated}>{t("send")}</button>
      <p className="cf-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
