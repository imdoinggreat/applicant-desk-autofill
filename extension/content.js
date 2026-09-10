(() => {
  if (window.__applicantDeskAutofillLoaded) return;
  window.__applicantDeskAutofillLoaded = true;

  const clean = (value) => (value || '').toLowerCase().replace(/[\s_\-\/]+/g, ' ').trim();
  const textFor = (element) => {
    const labels = [];
    if (element.id) {
      document.querySelectorAll('label[for="' + CSS.escape(element.id) + '"]').forEach((label) => labels.push(label.textContent));
    }
    const parentLabel = element.closest('label');
    if (parentLabel) labels.push(parentLabel.textContent);
    ['aria-label', 'name', 'placeholder', 'autocomplete'].forEach((attr) => labels.push(element.getAttribute(attr)));
    const fieldset = element.closest('fieldset');
    if (fieldset?.querySelector('legend')) labels.push(fieldset.querySelector('legend').textContent);
    return clean(labels.filter(Boolean).join(' '));
  };

  const setNativeValue = (element, value) => {
    const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (setter) setter.call(element, value);
    else element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const looksLike = (label, patterns) => patterns.some((pattern) => label.includes(pattern));
  const valueFor = (label, profile) => {
    const customFields = profile.customFields || {};
    const customMatch = Object.entries(customFields).find(([alias]) => label.includes(clean(alias)));
    if (customMatch && typeof customMatch[1] === 'string') return customMatch[1];
    if (looksLike(label, ['reference', 'recommender']) && looksLike(label, ['email'])) return profile.ref1Email;
    if (looksLike(label, ['reference', 'recommender']) && looksLike(label, ['name'])) return profile.ref1Name;
    if (looksLike(label, ['email', 'e mail'])) return profile.email;
    if (looksLike(label, ['first name', 'given name', 'forename', 'fname'])) return profile.firstName;
    if (looksLike(label, ['last name', 'family name', 'surname', 'lname'])) return profile.lastName;
    if (looksLike(label, ['preferred name', 'preferred first'])) return profile.preferredName;
    if (looksLike(label, ['country code', 'calling code'])) return profile.phoneCode;
    if (looksLike(label, ['phone', 'mobile', 'telephone', 'tel'])) return profile.phone;
    if (looksLike(label, ['date of birth', 'birth date', 'dob', 'bday'])) return profile.birthDate;
    if (looksLike(label, ['country of birth', 'birth country'])) return profile.birthCountry;
    if (looksLike(label, ['citizenship', 'nationality', 'country name'])) return profile.nationality;
    if (looksLike(label, ['visa', 'immigration status'])) return profile.visaStatus;
    if (looksLike(label, ['postal code', 'zip code', 'zip', 'postal-code'])) return profile.currentPostalCode;
    if (looksLike(label, ['state', 'province', 'region', 'address level1'])) return profile.currentRegion;
    if (looksLike(label, ['school city', 'university city', 'institution city'])) return profile.ugCity;
    if (looksLike(label, ['city', 'town', 'address level2'])) return profile.currentCity;
    if (looksLike(label, ['current country', 'residence country'])) return profile.currentCountry;
    if (looksLike(label, ['mailing address', 'correspondence address'])) return profile.mailingAddress;
    if (looksLike(label, ['permanent address', 'home address'])) return profile.permanentAddress;
    if (looksLike(label, ['current address', 'residential address', 'street address', 'address line'])) return profile.currentAddress;
    if (looksLike(label, ['current location', 'currently located', 'where do you live'])) return profile.currentLocation;
    if (looksLike(label, ['employer', 'company', 'organization'])) return profile.employer;
    if (looksLike(label, ['job title', 'position', 'role'])) return profile.jobTitle;
    if (looksLike(label, ['undergraduate school', 'university', 'college', 'institution', 'school'])) return profile.ugSchool;
    if (looksLike(label, ['major', 'field of study', 'concentration'])) return profile.ugMajor;
    if (looksLike(label, ['degree', 'academic degree'])) return profile.ugDegree;
    if (looksLike(label, ['gpa', 'grade point'])) return profile.ugGpa;
    if (looksLike(label, ['graduate test', 'test name']) && !looksLike(label, ['english', 'toefl', 'ielts', 'duolingo'])) return profile.gradTest;
    if (looksLike(label, ['gre', 'gmat', 'graduate test']) && looksLike(label, ['score', 'result', 'total'])) return profile.gradScore;
    if (looksLike(label, ['english test', 'language test'])) return profile.englishTest;
    if (looksLike(label, ['toefl', 'ielts', 'duolingo', 'english']) && looksLike(label, ['score', 'result', 'total'])) return profile.englishScore;
    return '';
  };

  const pickOption = (select, value) => {
    const target = clean(value);
    if (!target) return false;
    const options = [...select.options];
    const match = options.find((option) => clean(option.value) === target || clean(option.textContent) === target)
      || options.find((option) => target.includes(clean(option.textContent)) || clean(option.textContent).includes(target));
    if (!match || !match.value) return false;
    select.value = match.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  const fill = (profile) => {
    let filled = 0;
    let skipped = 0;
    document.querySelectorAll('input, textarea, select').forEach((element) => {
      if (element.disabled || element.readOnly || element.type === 'hidden' || ['password', 'file', 'submit', 'button'].includes(element.type)) return;
      const label = textFor(element);
      const value = valueFor(label, profile);
      if (!value) return;
      if (element.value && element.value.trim() && element.value !== '0') {
        skipped += 1;
        return;
      }
      const changed = element instanceof HTMLSelectElement ? pickOption(element, value) : (setNativeValue(element, value), true);
      if (changed) filled += 1;
    });
    return { filled, skipped };
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'fill') sendResponse(fill(message.profile || {}));
    return true;
  });
})();
