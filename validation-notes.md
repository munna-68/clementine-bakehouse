# Live Validation Notes

The five customer-facing routes were captured at desktop and mobile widths. The layout remains legible at a 390px mobile viewport, including the menu cards, capacity-aware custom order date grid, quote/deposit panel, and contact form. TypeScript validation and a production build completed successfully.

The hero image is the original generated Clementine Bakehouse photograph. The remaining visual areas use intentionally designed tactile object illustrations because the image-generation quota reached its daily limit before supplementary assets could be created.

The next interaction checks focus on the local React flows: standard-item basket behavior, custom-request form submission, capacity-date availability, tracking-code lookup, and mock-deposit state changes.

The standard-item basket interaction was exercised in the live page. After two add-to-order actions, the accessible cart label updated to `Open order, 2 items`, confirming that instant menu ordering updates shared local state.

The custom-order form was loaded with its lead-time-aware calendar. Multiple dates were visibly unavailable and marked `full`; available dates showed remaining capacity. A populated occasion field followed by form submission transitioned to the confirmation view with the generated tracking code `CB-9051`, confirming the request-to-tracking handoff.

The sample quoted order `CB-2408` displayed a complete quote, a 50% deposit requirement, and the calculated remaining balance. Activating the deposit action transitioned the mock customer state to `Deposit paid` and replaced the payment prompt with a confirmation plus the remaining-balance schedule.
