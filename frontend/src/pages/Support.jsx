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
        title="Help center"
        subtitle="Answers to common questions about Flasher."
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden">
                {faq.question}
                <ChevronDownIcon
                  size={18}
                  className="shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="pb-5 text-sm leading-6 text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </section>

        <aside className="h-fit lg:sticky lg:top-4">
          <h2 className="font-semibold">Still need help?</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Send us the page link and what went wrong. We will take a look.
          </p>
          <a
            href="mailto:kg877253@gmail.com?subject=Flasher%20support"
            className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
          >
            Email support
          </a>
        </aside>
      </div>
    </div>
  );
}