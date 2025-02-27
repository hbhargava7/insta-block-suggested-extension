// content.js
(function () {
  const hide = (element) => {
    if (element && element.style.display !== "none") {
      console.log('Hiding element:', element);
      element.style.display = "none";
    }
  };

  const hiddenArticles = new Set();

  const processPage = () => {
    console.log('Running processPage...');

    const body = document.body;
    let caughtUpSection = null;
    let suggestedPostsSection = null;

    const spans = body.querySelectorAll('span');
    spans.forEach(span => {
      if (span.textContent.includes("re all caught up")) {
        console.log('Found "You\'re all caught up" section:', span);
        caughtUpSection = span.closest('div');
      }
      if (span.textContent.includes("Suggested Posts")) {
        console.log('Found "Suggested Posts" section:', span);
        suggestedPostsSection = span.closest('div');
      }
    });

    const targetSection = caughtUpSection || suggestedPostsSection;

    if (targetSection) {
      const relevantElements = document.querySelectorAll('article, div');
      let startHiding = false;

      relevantElements.forEach(element => {
        if (element === targetSection) {
          startHiding = true;
        } else if (startHiding && element.tagName.toLowerCase() === 'article') {
          if (!hiddenArticles.has(element)) {
            hide(element);
            hiddenArticles.add(element);
          }
        }
      });
    }

    // Hide articles containing "Suggested for you"
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
      const spans = article.querySelectorAll('span');
      spans.forEach(span => {
        if (span.textContent.includes("Suggested for you")) {
          console.log('Found "Suggested for you" article:', article);
          hide(article);
        }
      });
    });
  };

  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        processPage();
        break;
      }
    }
  });

  mutationObserver.observe(document, {
    subtree: true,
    childList: true
  });

  processPage();
})();
