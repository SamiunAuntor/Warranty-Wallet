import React from "react";

const Privacy = () => {
    return (
        <div className="w-11/12 max-w-3xl mx-auto py-12 md:py-16 space-y-8">
            <header>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                    Privacy Policy
                </h1>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    This Privacy Policy explains how <span className="font-semibold">WarrantyWallet</span> collects,
                    uses, and protects your information when you use our web application.
                </p>
            </header>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    1. Information We Collect
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We collect information to provide you with a secure and seamless warranty
                    management experience. This may include:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
                    <li>
                        <span className="font-semibold">Account information</span> – such as your
                        name, email address, and profile details provided during registration.
                    </li>
                    <li>
                        <span className="font-semibold">Product and warranty data</span> – details
                        of products you add, purchase invoices, warranty periods, and related notes.
                    </li>
                    <li>
                        <span className="font-semibold">Usage data</span> – basic analytics such as
                        pages visited, actions taken, and device/browser details, used to improve
                        app performance and UX.
                    </li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    2. How We Use Your Information
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm md:text-base leading-relaxed">
                    <li>To create and maintain your WarrantyWallet account.</li>
                    <li>To store and display your products, warranties, and invoices.</li>
                    <li>To send reminder emails before a warranty expires (where enabled).</li>
                    <li>To secure the platform, detect misuse, and prevent fraud.</li>
                    <li>To improve features, performance, and the overall user experience.</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    3. Data Security
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We take reasonable technical and organizational measures to protect your data
                    from unauthorized access, loss, or disclosure. However, no method of
                    transmission or storage is completely secure, and we cannot guarantee absolute
                    security.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    4. Third‑Party Services
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    WarrantyWallet may use trusted third‑party services (such as authentication
                    providers, email services, and cloud hosting) to operate the application. These
                    providers process your data only to the extent necessary to provide their
                    services to us.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    5. Your Rights
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Depending on your location, you may have rights over your personal data, such as
                    the ability to access, update, or delete your information. You can typically
                    manage most of your data directly from your account dashboard.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    6. Changes to This Policy
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    We may update this Privacy Policy from time to time. When we do, we will update
                    the “Last updated” date at the top of this page. Your continued use of
                    WarrantyWallet after changes are published means you accept the updated policy.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    7. Contact Us
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    If you have any questions about this Privacy Policy or how we handle your data,
                    please contact us at{" "}
                    <span className="font-semibold">support@warrantywallet.app</span> (replace with
                    your actual support email).
                </p>
            </section>
        </div>
    );
};

export default Privacy;

