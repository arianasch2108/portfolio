# Scrollable mockup

“Scrollable mockup” refers to the approved laptop artifact in the Opportunity section of the Priority Issues Hub case study.

Reference implementation: src/components/case-study/PrioritiesScreenshot.astro

When the user requests a scrollable mockup, follow these guidelines:

- Frame the page in a laptop with a dark bezel, small camera detail, and metallic base.
- Use a warm gray canvas with rounded outer corners. Keep screenshot edges inside the device square.
- Crop side padding so the screenshot hero fills the screen width.
- For multiple screenshots, stitch them visually into one continuous page. Remove repeated navigation, scrollbars, floating controls, and duplicated overlapping content. Preserve the original screenshots and their text; use SVG crops or CSS layout.
- Use a fixed-height screen with a 16:10 aspect ratio and vertical internal scrolling. Do not expand the device to the full screenshot height.
- Contain scrolling with overscroll-behavior-y: contain so reaching either end does not scroll the portfolio page.
- Support mouse, touch, and keyboard scrolling. Make the scroll region focusable, give it an accessible label, and provide a visible focus indicator.
- Include a page-specific caption: “Scroll within the laptop to explore the [Page name]”.
- Do not link the screenshot to a full-size image or add fullscreen expansion.
- Keep the mockup responsive without horizontal page overflow.
- Verify internal scrolling and confirm that scrolling at its boundaries leaves the surrounding page stationary.

Apply this pattern when requested; do not convert other existing mockups automatically.
