document.addEventListener('DOMContentLoaded', () => {
  const pageSections = document.querySelectorAll('.page-wrapper');
  const navItems = document.querySelectorAll('.nav-item');
  const navMenu = document.getElementById('nav-menu');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const currentYearSpan = document.getElementById('current-year');

  // Set footer copyright year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Function to navigate between pages
  function navigateTo(targetPageId) {
    pageSections.forEach(section => {
      section.classList.remove('active');
    });

    const targetSection = document.getElementById(`page-${targetPageId}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    navItems.forEach(item => {
      if (item.getAttribute('data-page') === targetPageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (navMenu) {
      navMenu.classList.remove('open');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event Delegation for all elements with data-page attribute
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-page]');
    if (trigger) {
      const pageId = trigger.getAttribute('data-page');
      navigateTo(pageId);
    }
  });

  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
});

// ====================== PEOPLE TAB =========================
document.addEventListener("DOMContentLoaded", () => {
  fetch("people.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => renderPeople(data))
    .catch((error) => console.error("Error loading people data:", error));
});

function renderPeople(people) {
  const containers = {
    pi: document.getElementById("pi-container"),
    phd: document.getElementById("phd-container"),
    bsms: document.getElementById("bsms-container"),
    intern: document.getElementById("intern-container"),
    "alumni-jrf": document.getElementById("alumni-jrf-container"),
    "alumni-phd": document.getElementById("alumni-phd-container"),
    "alumni-bsms": document.getElementById("alumni-bsms-container"),
  };

  Object.values(containers).forEach((c) => {
    if (c) c.innerHTML = "";
  });

  people.forEach((person) => {
    let targetContainer = null;

    if (person.category === "alumni") {
      const roleLower = person.role.toLowerCase();
      if (roleLower.includes("jrf") || roleLower.includes("junior research fellow")) {
        targetContainer = containers["alumni-jrf"];
      } else if (roleLower.includes("phd") || roleLower.includes("ph.d")) {
        targetContainer = containers["alumni-phd"];
      } else if (roleLower.includes("bsms") || roleLower.includes("bs-ms")) {
        targetContainer = containers["alumni-bsms"];
      }
    } else {
      targetContainer = containers[person.category];
    }

    if (targetContainer) {
      targetContainer.appendChild(createCard(person));
    }
  });
}

function createCard(person) {
  const card = document.createElement("div");

  if (person.category === "pi") {
    card.className = `pi-card`;
    const nameHTML = person.linkedin
      ? `<a href="${person.linkedin}" target="_blank" rel="noopener noreferrer" class="linkedin-link">${person.name}</a>`
      : person.name;

    card.innerHTML = `
      <img src="${person.image}" alt="${person.name}" class="person-img" onerror="this.src='images/default.jpg'">
      <div class="person-info">
        <h3 class="person-name" style="font-size: 1.4rem; color: #fff; margin-bottom: 5px;">${nameHTML}</h3>
        <p class="person-role" style="color: var(--accent-blue); font-weight: 600; margin-bottom: 10px;">${person.role}</p>
        <p class="person-bio" style="color: var(--text-muted);">${person.bio}</p>
      </div>
    `;
    return card;
  }

  card.className = person.category === "alumni" ? "person-card alumni-card" : `person-card ${person.category}-card`;

  const nameHTML = person.linkedin
    ? `<a href="${person.linkedin}" target="_blank" rel="noopener noreferrer" class="linkedin-link">${person.name}</a>`
    : person.name;

  card.innerHTML = `
    <div class="person-main-item">
      <div class="person-header-content">
        <img src="${person.image}" alt="${person.name}" class="person-img-thumb" onerror="this.src='images/default.jpg'">
        <div class="person-text-info">
          <span>${nameHTML}</span>
          <span class="person-role">${person.role}</span>
        </div>
      </div>
      <div class="person-sub-item">
        <h4>${person.bio || ""}</h4>
      </div>
      ${person.work ? `<div class="person-sub-item">${person.work}</div>` : ""}
    </div>
  `;

  return card;
}

// ====================== TEACHING TAB =========================
document.addEventListener("DOMContentLoaded", () => {
  fetch("teaching.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => renderCourses(data))
    .catch((error) => console.error("Error loading teaching data:", error));
});

function renderCourses(courses) {
  const containers = {
    odd: document.getElementById("odd-container"),
    even: document.getElementById("even-container"),
  };

  Object.values(containers).forEach((c) => {
    if (c) c.innerHTML = "";
  });

  courses.forEach((course) => {
    const targetContainer = containers[course.semesterType];
    if (targetContainer) {
      targetContainer.appendChild(createCourseCard(course));
    }
  });
}

function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = `course-card ${course.semesterType}-card`;

  const subTopicsHTML = course.topics && Array.isArray(course.topics)
    ? course.topics.map(topic => `<li class="course-sub-item">${topic}</li>`).join('')
    : `<li class="course-sub-item">${course.description || ''}</li>`;

  const yearHTML = course.year ? `<span class="course-year">${course.year}</span>` : '';

  card.innerHTML = `
    <ul class="course-main-list">
      <li class="course-main-item">
        <div class="course-header-content">
          <span>${course.title}</span>
          <span class="course-code">${course.code}</span>
        </div>
        <div class="course-meta">
          <span class="course-semester">${course.semester}</span>
          ${yearHTML}
        </div>
        <ul class="course-sub-list">
          ${subTopicsHTML}
        </ul>
      </li>
    </ul>
  `;

  return card;
}

// ====================== NEWS AND ALERTS =========================
document.addEventListener("DOMContentLoaded", () => {
  fetch("news.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => renderNewsAndAlerts(data))
    .catch((error) => console.error("Error loading news data:", error));
});

function renderNewsAndAlerts(items) {
  const containers = {
    news: document.getElementById("news-container"),
    alert: document.getElementById("alert-container"),
  };

  Object.values(containers).forEach((c) => {
    if (c) c.innerHTML = "";
  });

  items.forEach((item) => {
    const targetContainer = containers[item.type];
    if (targetContainer) {
      targetContainer.appendChild(createNewsCard(item));
    }
  });
}

function createNewsCard(item) {
  const card = document.createElement("div");
  card.className = `news-card ${item.type}-item-card`;

  card.innerHTML = `
    <div class="news-header-content">
      <h3 class="news-title">${item.title}</h3>
      <span class="news-badge">${item.badgeText}</span>
    </div>
    <div class="news-date">${item.date}</div>
    <p class="news-desc">${item.description}</p>
  `;

  return card;
}

// ====================== PUBLICATIONS =========================
document.addEventListener("DOMContentLoaded", () => {
  fetch("publications.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then((data) => renderPublications(data))
    .catch((error) => console.error("Error loading publications data:", error));
});

function renderPublications(pubs) {
  const containers = {
    journal: document.getElementById("journal-container"),
    conference: document.getElementById("conference-container"),
  };

  Object.values(containers).forEach((c) => {
    if (c) c.innerHTML = "";
  });

  pubs.forEach((pub) => {
    const targetContainer = containers[pub.type];
    if (targetContainer) {
      targetContainer.appendChild(createPubCard(pub));
    }
  });
}

function createPubCard(pub) {
  const card = document.createElement("div");
  card.className = `pub-card ${pub.type}-item-card`;

  let linksHTML = "";
  if (pub.doi) {
    linksHTML += `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer" class="pub-link">DOI &rarr;</a>`;
  }
  if (pub.pdf) {
    linksHTML += `<a href="${pub.pdf}" target="_blank" rel="noopener noreferrer" class="pub-link">PDF &rarr;</a>`;
  }

  card.innerHTML = `
    <div class="pub-header-content">
      <h3 class="pub-title">${pub.title}</h3>
      <span class="pub-badge">${pub.year}</span>
    </div>
    <div class="pub-authors">${pub.authors}</div>
    <div class="pub-journal">${pub.journal}</div>
    ${linksHTML ? `<div class="pub-links">${linksHTML}</div>` : ""}
  `;

  return card;
}