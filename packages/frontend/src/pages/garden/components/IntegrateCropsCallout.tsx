/**
 * For projects that want the CROPS evaluations as data rather than as a page.
 * Deliberately thin for now - there is no endpoint to point at yet.
 */
export function IntegrateCropsCallout() {
  return (
    <div className="mt-4 rounded-xl border border-[#cfe3c0] border-dashed bg-surface-primary/70 p-4 max-md:mx-4 md:mt-6 md:px-6 md:py-5 dark:border-[#2c3a22]">
      <p className="font-bold text-heading-16 md:text-heading-20">
        Integrate CROPS
      </p>
      <p className="mt-1 text-paragraph-13 text-secondary md:text-paragraph-15">
        Want to pull these evaluations into your own app? An API is coming.
      </p>
    </div>
  )
}
