import React from "react";

const Terms = () => {
    return (
        <div className="w-11/12 max-w-3xl mx-auto py-12 md:py-16 space-y-8">
            <header>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                    Terms &amp; Conditions
                </h1>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use
                    of the <span className="font-semibold">WarrantyWallet</span> application.
                    By creating an account or using the app, you agree to these Terms.
                </p>
            </header>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    1. Use of the Service
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    WarrantyWallet helps you store and manage product warranties and related
                    documents. You agree to use the service only for lawful purposes and in
                    accordance with these Terms.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    2. Account Responsibility
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    You are responsible for maintaining the confidentiality of your login
                    credentials and for all activities that occur under your account. Notify us
                    immediately if you suspect any unauthorized access or breach of security.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    3. Content You Add
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    You may upload invoices, product details, and other information for your own
                    use. You are responsible for ensuring that this content is accurate and that you
                    have the right to store it. Do not upload content that is illegal, abusive, or
                    violates the rights of others.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    4. No Warranty on Outcomes
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    WarrantyWallet does not guarantee that a manufacturer or seller will honor any
                    warranty. The app is a tool to help you track information and reminders, but it
                    does not replace the terms of the original product warranty.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    5. Service Availability
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We aim to keep WarrantyWallet available and performant, but we do not guarantee
                    uninterrupted or error‑free operation. We may suspend or modify the service
                    temporarily for maintenance or improvements.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    6. Limitation of Liability
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    To the maximum extent permitted by law, WarrantyWallet is not liable for any
                    indirect, incidental, or consequential damages arising from your use of the
                    service, including lost data, missed warranty claims, or business losses.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    7. Changes to These Terms
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We may update these Terms from time to time. When we do, we will update the
                    &quot;Last updated&quot; date at the top of this page. If you continue to use
                    the app after changes are published, you are agreeing to the updated Terms.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    8. Contact
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    If you have any questions about these Terms &amp; Conditions, please contact us
                    at <span className="font-semibold">support@warrantywallet.app</span> (replace
                    with your actual support email).
                </p>
            </section>
        </div>
    );
};

export default Terms;

