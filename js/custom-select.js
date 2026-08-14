/* STACKLY - Universal Custom Dropdown / Select Component System */

(function() {
  'use strict';

  function initCustomSelect(selectEl) {
    if (!selectEl || selectEl.dataset.customSelectInitialized === 'true') return;

    selectEl.dataset.customSelectInitialized = 'true';
    selectEl.classList.add('custom-select-hidden');

    // Create wrapper container
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'combobox');
    wrapper.setAttribute('aria-expanded', 'false');
    wrapper.setAttribute('aria-haspopup', 'listbox');

    // If native select had custom classes like form-select or auth-form-select, mirror relevant sizing
    if (selectEl.classList.contains('form-select')) {
      wrapper.classList.add('form-select-wrapper');
    }
    if (selectEl.classList.contains('auth-form-select')) {
      wrapper.classList.add('auth-form-select-wrapper');
    }

    // Create trigger button
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';

    const valueSpan = document.createElement('span');
    valueSpan.className = 'custom-select-value';

    const arrowDiv = document.createElement('div');
    arrowDiv.className = 'custom-select-arrow';
    arrowDiv.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    trigger.appendChild(valueSpan);
    trigger.appendChild(arrowDiv);
    wrapper.appendChild(trigger);

    // Create options menu dropdown card
    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');
    wrapper.appendChild(menu);

    // Populate options
    function buildOptions() {
      menu.innerHTML = '';
      const options = Array.from(selectEl.options);
      let selectedIndex = selectEl.selectedIndex;

      options.forEach((opt, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'custom-select-option';
        optionDiv.setAttribute('role', 'option');
        optionDiv.dataset.value = opt.value;
        optionDiv.dataset.index = index;

        const textSpan = document.createElement('span');
        textSpan.textContent = opt.text;
        optionDiv.appendChild(textSpan);

        // Checkmark indicator SVG
        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('class', 'custom-select-check');
        checkSvg.setAttribute('width', '14');
        checkSvg.setAttribute('height', '14');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', 'currentColor');
        checkSvg.setAttribute('stroke-width', '3');
        checkSvg.setAttribute('stroke-linecap', 'round');
        checkSvg.setAttribute('stroke-linejoin', 'round');
        checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        optionDiv.appendChild(checkSvg);

        if (opt.disabled) {
          optionDiv.classList.add('is-disabled');
        }

        if (index === selectedIndex) {
          optionDiv.classList.add('is-selected');
        }

        optionDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          if (opt.disabled) return;
          selectOption(index);
          closeDropdown();
        });

        menu.appendChild(optionDiv);
      });

      updateTriggerValue();
    }

    function updateTriggerValue() {
      const selectedOpt = selectEl.options[selectEl.selectedIndex];
      if (selectedOpt) {
        valueSpan.textContent = selectedOpt.text;
        if (selectedOpt.disabled || selectedOpt.value === '') {
          valueSpan.classList.add('is-placeholder');
        } else {
          valueSpan.classList.remove('is-placeholder');
        }
      } else {
        valueSpan.textContent = '';
        valueSpan.classList.add('is-placeholder');
      }

      // Sync option highlight states
      const optionDivs = menu.querySelectorAll('.custom-select-option');
      optionDivs.forEach((div, i) => {
        if (i === selectEl.selectedIndex) {
          div.classList.add('is-selected');
        } else {
          div.classList.remove('is-selected');
        }
      });
    }

    function selectOption(index) {
      if (selectEl.selectedIndex !== index) {
        selectEl.selectedIndex = index;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        selectEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
      updateTriggerValue();
    }

    function openDropdown() {
      // Close any other open custom dropdowns on the page
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('open');
          w.setAttribute('aria-expanded', 'false');
        }
      });

      wrapper.classList.add('open');
      wrapper.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      wrapper.classList.remove('open');
      wrapper.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown() {
      if (wrapper.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    // Toggle on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Keyboard navigation support
    wrapper.addEventListener('keydown', (e) => {
      const isOpen = wrapper.classList.contains('open');
      const optionDivs = Array.from(menu.querySelectorAll('.custom-select-option:not(.is-disabled)'));
      let currentIndex = optionDivs.findIndex(div => div.classList.contains('is-selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (optionDivs.length > 0) {
          const nextIndex = (currentIndex + 1) % optionDivs.length;
          const targetOptIndex = parseInt(optionDivs[nextIndex].dataset.index, 10);
          selectOption(targetOptIndex);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (optionDivs.length > 0) {
          const prevIndex = (currentIndex - 1 + optionDivs.length) % optionDivs.length;
          const targetOptIndex = parseInt(optionDivs[prevIndex].dataset.index, 10);
          selectOption(targetOptIndex);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      } else if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    // Sync UI when underlying select element fires change/reset
    selectEl.addEventListener('change', updateTriggerValue);

    const parentForm = selectEl.closest('form');
    if (parentForm) {
      parentForm.addEventListener('reset', () => {
        setTimeout(updateTriggerValue, 10);
      });
    }

    buildOptions();

    // Insert wrapper directly after select in DOM
    selectEl.parentNode.insertBefore(wrapper, selectEl.nextSibling);
  }

  function initAllCustomSelects() {
    const selects = document.querySelectorAll('select');
    selects.forEach(initCustomSelect);
  }

  // Auto-init and observe for dynamic selects
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.tagName === 'SELECT') {
            initCustomSelect(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll('select').forEach(initCustomSelect);
          }
        }
      });
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAllCustomSelects();
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  } else {
    initAllCustomSelects();
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.initCustomSelects = initAllCustomSelects;
})();
