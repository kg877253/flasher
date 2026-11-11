import { Link } from "react-router-dom";
import { ChevronDownIcon, SupportIcon } from "../components/Icons";
import PageHeader from "../components/PageHeader";

const FAQS = [
  {
    question: "How do I upload a video?",
    answer: "Open My Content from the sidebar and choose Upload video. Add a title, description, video file and thumbnail, then publish it.",
  },
  {
    question: "Can I hide a video without deleting it?",
    answer: "Yes. In My Content, use the publish switch on a video. Hidden videos are kept in your dashboard but are not shown publicly.",
  },
  {
    question: "How do playlists work?",
    answer: "Open any video, choose Save, and select a playlist. You can create, rename and delete playlists from Collection.",
  },
  {
    question: "How can I report a problem?",
    answer: "Send us the page URL, what you expected to happen, and any visible error message. This makes it much easier to investigate.",
  },
];

export default function Support() {
  return (
    <div className="fade-up mx-auto max-w-5xl">
      <PageHeader
        icon={SupportIcon}
        eyebrow="Help center"
        title="How can we help?"
        description="Find quick answers about uploading, playlists, your channel and account."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="space-y-3">
          <h2 className="px-1 text-lg font-semibold">Frequently asked questions</h2>
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium marker:hidden">
                {faq.question}
                <ChevronDownIcon
                  size={18}
                  className="shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="border-t border-white/10 px-4 pb-4 pt-3 text-sm leading-6 text-gray-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <h2 className="text-lg font-semibold">Still need help?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            Tell us what went wrong and we will help you get back to creating.
          </p>
          <a
            href="mailto:kg877253@gmail.com?subject=Flasher%20support"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Contact support
          </a>
          <Link
            to="/"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            Back to home
          </Link>
        </aside>
      </div>
    </div>
  );
}
