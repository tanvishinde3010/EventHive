

const departments = [
    {
        name: "Computer Engineering",
        code: "COMP",
        icon: "💻"
    },

    {
        name: "Information Technology",
        code: "IT",
        icon: "🌐"
    },

    {
        name: "Artificial Intelligence & Data Science",
        code: "AI & DS",
        icon: "🤖"
    },

    {
        name: "Civil Engineering",
        code: "CIVIL",
        icon: "🏗️"
    },

    {
        name: "Mechanical Engineering",
        code: "MECH",
        icon: "⚙️"
    },

    {
        name: "Electronics & Telecommunication",
        code: "ENTC",
        icon: "📡"
    }
];




const events = [

    {
        name: "AI Hackathon",
        department: "AI & DS",
        category: "Technical",
        date: "15 October 2026",
        time: "10:00 AM - 4:00 PM",
        venue: "Seminar Hall",
        description: "A technical hackathon where students build innovative AI-based solutions.",
        image: "../images/hackathon.jpeg"
    },

    {
        name: "Web Development Workshop",
        department: "COMP",
        category: "Workshop",
        date: "20 October 2026",
        time: "11:00 AM - 2:00 PM",
        venue: "Computer Lab",
        description: "Learn modern web development concepts and build a basic website.",
        image: "../images/workshop.jpeg"
    },

    {
        name: "Annual Sports Day",
        department: "ALL",
        category: "Sports",
        date: "25 October 2026",
        time: "9:00 AM - 5:00 PM",
        venue: "College Ground",
        description: "An exciting sports event featuring various indoor and outdoor competitions.",
        image: "../images/sports.jpeg"
    },

    {
        name: "Coding Competition",
        department: "COMP",
        category: "Technical",
        date: "28 October 2026",
        time: "10:00 AM - 1:00 PM",
        venue: "Computer Lab 2",
        description: "Test your programming and problem-solving skills through challenging coding problems.",
        image: "../images/hackathon.jpeg"
    },

    {
        name: "Tech Talk on Generative AI",
        department: "AI & DS",
        category: "Seminar",
        date: "2 November 2026",
        time: "11:00 AM - 1:00 PM",
        venue: "Auditorium",
        description: "An interactive session introducing students to Generative AI and its applications.",
        image: "../images/workshop.jpeg"
    },

    {
        name: "Robotics Workshop",
        department: "ENTC",
        category: "Workshop",
        date: "5 November 2026",
        time: "10:00 AM - 3:00 PM",
        venue: "Innovation Lab",
        description: "A hands-on workshop where students learn the basics of robotics and automation.",
        image: "../images/workshop.jpeg"
    },

    {
        name: "CAD Design Competition",
        department: "MECH",
        category: "Competition",
        date: "8 November 2026",
        time: "10:00 AM - 2:00 PM",
        venue: "Mechanical Lab",
        description: "Showcase your creativity and technical skills through computer-aided design.",
        image: "../images/hackathon.jpeg"
    },

    {
        name: "Smart City Project Exhibition",
        department: "CIVIL",
        category: "Exhibition",
        date: "12 November 2026",
        time: "10:00 AM - 4:00 PM",
        venue: "Main Exhibition Hall",
        description: "Students present innovative ideas and projects for future smart cities.",
        image: "../images/college.jpeg"
    },

    {
        name: "Cultural Fest",
        department: "ALL",
        category: "Cultural",
        date: "18 November 2026",
        time: "5:00 PM - 9:00 PM",
        venue: "College Auditorium",
        description: "A celebration of music, dance, drama and cultural performances by students.",
        image: "../images/college.jpeg"
    },

    {
        name: "Career Guidance Seminar",
        department: "ALL",
        category: "Seminar",
        date: "22 November 2026",
        time: "11:00 AM - 1:00 PM",
        venue: "Seminar Hall",
        description: "A career guidance session covering placements, higher studies and industry opportunities.",
        image: "../images/college.jpeg"
    }

];




function displayEvents() {

    const eventContainer =
        document.getElementById("eventContainer");

    eventContainer.innerHTML = "";

    events.forEach(function(event) {

        eventContainer.innerHTML += `

            <div class="event-card">

                <img src="${event.image}"
                     alt="${event.name}">

                <div class="event-content">

                    <h3>${event.name}</h3>

                    <p>🏢 ${event.department}</p>

                    <p>📌 ${event.category}</p>

                    <p>📅 ${event.date}</p>

                    <p>⏰ ${event.time}</p>

                    <p>📍 ${event.venue}</p>

                    <p>${event.description}</p>

                    <button
                        class="main-btn"
                        onclick="showEventDetails('${event.name}')">

                        View Details

                    </button>

                    <button
                        class="main-btn"
                        onclick="registerEvent('${event.name}')">

                        Register

                    </button>

                </div>

            </div>

        `;
    });
}



function displayDepartments() {

    const departmentContainer =
        document.getElementById("departmentContainer");

    departmentContainer.innerHTML = "";

    departments.forEach(function(department) {

        departmentContainer.innerHTML += `

            <div class="department-card">

                <div class="department-icon">
                    ${department.icon}
                </div>

                <h3>${department.code}</h3>

                <p>
                    ${department.name}
                </p>

                <button
                    class="main-btn"
                    onclick="showDepartmentEvents('${department.code}')">

                    View Events

                </button>

            </div>

        `;
    });
}




function showDepartmentEvents(departmentCode) {

    const filteredEvents = events.filter(function(event) {

        return event.department === departmentCode ||
               event.department === "ALL";

    });

    const eventContainer =
        document.getElementById("eventContainer");

    eventContainer.innerHTML = "";

    filteredEvents.forEach(function(event) {

        eventContainer.innerHTML += `

            <div class="event-card">

                <img src="${event.image}"
                     alt="${event.name}">

                <div class="event-content">

                    <h3>${event.name}</h3>

                    <p>🏢 ${event.department}</p>

                    <p>📌 ${event.category}</p>

                    <p>📅 ${event.date}</p>

                    <p>⏰ ${event.time}</p>

                    <p>📍 ${event.venue}</p>

                    <p>${event.description}</p>

                    <button
                        class="main-btn"
                        onclick="showEventDetails('${event.name}')">

                        View Details

                    </button>

                    <button
                        class="main-btn"
                        onclick="registerEvent('${event.name}')">

                        Register

                    </button>

                </div>

            </div>

        `;
    });

    document.getElementById("events")
        .scrollIntoView({
            behavior: "smooth"
        });
}




function registerEvent(eventName) {

    document.getElementById("registrationEventName").textContent =
        eventName;

    document.getElementById("registrationMessage").textContent =
        "";

    document.getElementById("registrationForm").reset();

    const modal = document.getElementById("registrationModal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

}


function closeRegistration() {

    const modal = document.getElementById("registrationModal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

}


// ---------- REGISTRATION FORM VALIDATION + LOCAL STORAGE ----------

document.getElementById("registrationForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const email =
            document.getElementById("studentEmail").value.trim();

        const phone =
            document.getElementById("studentPhone").value.trim();

        const department =
            document.getElementById("studentDepartment").value;

        const eventName =
            document.getElementById("registrationEventName").textContent;

        const message =
            document.getElementById("registrationMessage");

        const namePattern =
            /^[A-Za-z ]+$/;

        if (name === "") {

            message.textContent =
                "Please enter your full name.";
            message.style.color = "#F05A47";
            return;
        }

        if (!namePattern.test(name)) {

            message.textContent =
                "Name should contain only letters.";
            message.style.color = "#F05A47";
            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {

            message.textContent =
                "Please enter your email.";
            message.style.color = "#F05A47";
            return;
        }

        if (!emailPattern.test(email)) {

            message.textContent =
                "Please enter a valid email address.";
            message.style.color = "#F05A47";
            return;
        }

        const phonePattern =
            /^[0-9]{10}$/;

        if (phone === "") {

            message.textContent =
                "Please enter your phone number.";
            message.style.color = "#F05A47";
            return;
        }

        if (!phonePattern.test(phone)) {

            message.textContent =
                "Phone number must contain exactly 10 digits.";
            message.style.color = "#F05A47";
            return;
        }

        if (department === "") {

            message.textContent =
                "Please select your department.";
            message.style.color = "#F05A47";
            return;
        }

        const registration = {
            name: name,
            email: email,
            phone: phone,
            department: department,
            event: eventName
        };

        let registrations;

        try {
            const savedRegistrations =
                localStorage.getItem("registrations");

            registrations = savedRegistrations === null
                ? []
                : JSON.parse(savedRegistrations);
        } catch (error) {
            console.error("Unable to read registrations from localStorage.", error);
            message.textContent =
                "Unable to access saved registrations. Please check your browser storage settings.";
            message.style.color = "#F05A47";
            return;
        }

        if (!Array.isArray(registrations)) {
            console.error("Saved registrations are not stored as an array.");
            message.textContent =
                "Saved registration data is invalid. Please clear the registrations storage and try again.";
            message.style.color = "#F05A47";
            return;
        }

        registrations.push(registration);

        try {
            localStorage.setItem(
                "registrations",
                JSON.stringify(registrations)
            );
        } catch (error) {
            console.error("Unable to save registration to localStorage.", error);
            message.textContent =
                "Unable to save your registration. Please check your browser storage settings and try again.";
            message.style.color = "#F05A47";
            return;
        }

        message.textContent =
            "Registration submitted successfully!";
        message.style.color = "#29443F";

        document.getElementById("registrationForm").reset();

    });




function showEventDetails(eventName) {

    const selectedEvent = events.find(function(event) {

        return event.name === eventName;

    });

    if (!selectedEvent) {
        console.error("Unable to find event details for:", eventName);
        return;
    }

    const detailsImage = document.getElementById("detailsImage");
    detailsImage.src = selectedEvent.image;
    detailsImage.alt = selectedEvent.name;

    document.getElementById("detailsCategory").textContent =
        selectedEvent.category;

    document.getElementById("detailsName").textContent =
        selectedEvent.name;

    document.getElementById("detailsDepartment").textContent =
        "🏢 Department: " + selectedEvent.department;

    document.getElementById("detailsDate").textContent =
        "📅 Date: " + selectedEvent.date;

    document.getElementById("detailsTime").textContent =
        "⏰ Time: " + selectedEvent.time;

    document.getElementById("detailsVenue").textContent =
        "📍 Venue: " + selectedEvent.venue;

    document.getElementById("detailsDescription").textContent =
        selectedEvent.description;

    document.getElementById("detailsRegisterBtn").onclick =
        function() {
            registerEvent(selectedEvent.name);
        };

    const modal = document.getElementById("eventDetailsModal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

}


function closeEventDetails() {

    const modal = document.getElementById("eventDetailsModal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

}




function scrollToEvents() {

    document.getElementById("events")
        .scrollIntoView({
            behavior: "smooth"
        });
}




function openLogin() {

    const modal = document.getElementById("loginModal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    document.getElementById("loginMessage").textContent =
        "";

}


function showLogin() {

    openLogin();

}


function closeLogin() {

    const modal = document.getElementById("loginModal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

}




document.getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        const message =
            document.getElementById("loginMessage");

        if (email === "" || password === "") {

            message.textContent =
                "Please enter email and password.";
            message.style.color = "#F05A47";
            return;
        }

        if (
            email !== "student@gmail.com" ||
            password !== "123456"
        ) {

            message.textContent =
                "Invalid email or password.";
            message.style.color = "#F05A47";
            return;
        }

        try {
            localStorage.setItem("loggedInUser", email);
            localStorage.setItem("isLoggedIn", "true");
        } catch (error) {
            console.error("Unable to save login state.", error);
            message.textContent =
                "Unable to save your login state. Please check your browser storage settings.";
            message.style.color = "#F05A47";
            return;
        }

        message.textContent =
            "Login successful!";
        message.style.color = "#29443F";

        updateLoginButton();

        setTimeout(function() {
            closeLogin();
        }, 1000);

    });




function updateLoginButton() {

    const loginNav =
        document.getElementById("loginNav");

    const logoutNav =
        document.getElementById("logoutNav");

    try {
        const isLoggedIn =
            localStorage.getItem("isLoggedIn");

        const isLoggedInUser = isLoggedIn === "true";

        loginNav.style.display = isLoggedInUser
            ? "none"
            : "inline-block";

        logoutNav.style.display = isLoggedInUser
            ? "inline-block"
            : "none";
    } catch (error) {
        console.error("Unable to read login state.", error);
        loginNav.style.display = "inline-block";
        logoutNav.style.display = "none";
    }

}



function logoutUser() {

    try {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");
    } catch (error) {
        console.error("Unable to clear login state.", error);
        return;
    }

    updateLoginButton();

}




function searchEvents() {

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput.value.toLowerCase();

    const filteredEvents =
        events.filter(function(event) {

            return (
                event.name.toLowerCase().includes(searchText) ||
                event.department.toLowerCase().includes(searchText) ||
                event.category.toLowerCase().includes(searchText)
            );

        });

    const eventContainer =
        document.getElementById("eventContainer");

    eventContainer.innerHTML = "";

    filteredEvents.forEach(function(event) {

        eventContainer.innerHTML += `

            <div class="event-card">

                <img
                    src="${event.image}"
                    alt="${event.name}"
                >

                <div class="event-content">

                    <h3>${event.name}</h3>

                    <p>🏢 ${event.department}</p>

                    <p>📌 ${event.category}</p>

                    <p>📅 ${event.date}</p>

                    <p>⏰ ${event.time}</p>

                    <p>📍 ${event.venue}</p>

                    <p>${event.description}</p>

                    <button
                        class="main-btn"
                        onclick="showEventDetails('${event.name}')"
                    >
                        View Details
                    </button>

                    <button
                        class="main-btn"
                        onclick="registerEvent('${event.name}')"
                    >
                        Register
                    </button>

                </div>

            </div>

        `;

    });

}



function filterByCategory() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const selectedCategory =
        categoryFilter.value;

    let filteredEvents;

    if (selectedCategory === "All") {

        filteredEvents = events;

    } else {

        filteredEvents = events.filter(function(event) {

            return event.category === selectedCategory;

        });

    }

    const eventContainer =
        document.getElementById("eventContainer");

    eventContainer.innerHTML = "";

    filteredEvents.forEach(function(event) {

        eventContainer.innerHTML += `

            <div class="event-card">

                <img
                    src="${event.image}"
                    alt="${event.name}"
                >

                <div class="event-content">

                    <h3>${event.name}</h3>

                    <p>🏢 ${event.department}</p>

                    <p>📌 ${event.category}</p>

                    <p>📅 ${event.date}</p>

                    <p>⏰ ${event.time}</p>

                    <p>📍 ${event.venue}</p>

                    <p>${event.description}</p>

                    <button
                        class="main-btn"
                        onclick="showEventDetails('${event.name}')"
                    >
                        View Details
                    </button>

                    <button
                        class="main-btn"
                        onclick="registerEvent('${event.name}')"
                    >
                        Register
                    </button>

                </div>

            </div>

        `;

    });

}


// ---------- LOAD DATA ----------

displayEvents();
displayDepartments();
updateLoginButton();