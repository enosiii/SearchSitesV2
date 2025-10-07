let allSites = [];
const siteListContainer = document.getElementById('site-list-container');
const siteDetailsContainer = document.getElementById('site-details-container');
const searchInput = document.getElementById('site-search');
const searchContainer = document.getElementById('search-container');
// NEW: Define the initial view state for History API
const LIST_STATE = { view: 'list' }; 


// 1. Fetch the JSON data when the page loads
async function loadSites() {
    try {
        const response = await fetch('Sites.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allSites = await response.json();
        renderSiteList(allSites);
    } catch (error) {
        console.error("Could not load Sites.json:", error);
        siteListContainer.innerHTML = '<p>Error loading site data. Check console for details.</p>';
    }
}

// 2. Render the list of sites
function renderListAndShowSearch() {
    // Helper function to render the list view and show the search bar
    searchContainer.classList.remove('hidden');
    siteDetailsContainer.classList.add('hidden');
    siteListContainer.classList.remove('hidden');
    filterSites(); 
}

// 2. Render the list of sites (Modified to use renderListAndShowSearch)
function renderSiteList(sites) {
    // This function now focuses purely on rendering the list items.
    siteDetailsContainer.classList.add('hidden');
    siteListContainer.innerHTML = ''; 

    if (sites.length === 0) {
        siteListContainer.innerHTML = '<p>No sites found matching your search.</p>';
        return;
    }

    sites.forEach(site => {
        const item = document.createElement('div');
        item.classList.add('list-item');
        item.dataset.siteId = site.Sites; 

        item.innerHTML = `
            <strong>${site.Sites} • ${site.City}</strong>
            <br> Devices: ${site.Devices}
        `;

        item.addEventListener('click', () => showSiteDetails(site));
        siteListContainer.appendChild(item);
    });
    
    // Check if we are returning from a history event and should show the search
    if (history.state && history.state.view === 'list') {
        renderListAndShowSearch();
    }
}

// 3. Auto-filtering based on 'Sites' column
function filterSites() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredSites = allSites.filter(site => 
        site.Sites && site.Sites.toLowerCase().includes(searchTerm)
    );

    // Only update the list content here, not visibility
    const currentHTML = siteListContainer.innerHTML;
    siteListContainer.innerHTML = ''; // Clear temporary
    
    if (filteredSites.length === 0) {
        siteListContainer.innerHTML = '<p>No sites found matching your search.</p>';
    } else {
        filteredSites.forEach(site => {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.dataset.siteId = site.Sites; 

            item.innerHTML = `
                <strong>${site.Sites} • ${site.City}</strong>
                <br> Devices: ${site.Devices}
            `;
            item.addEventListener('click', () => showSiteDetails(site));
            siteListContainer.appendChild(item);
        });
    }
}


// 4. Show the details view when an item is clicked
function showSiteDetails(site) {
    // NEW: Push the 'details' state to the history stack. 
    // This makes the back button return to the previous state (the list view).
    history.pushState({ view: 'details', siteId: site.Sites }, `Details for ${site.Sites}`, `#details/${site.Sites}`);
    
    // Manually render the view for instant display (history will manage back navigation)
    searchContainer.classList.add('hidden'); 
    siteListContainer.classList.add('hidden');
    siteDetailsContainer.classList.remove('hidden');

    // Generate the Google Maps URL
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.Latitude},${site.Logitude}`;

    siteDetailsContainer.innerHTML = `
        <button class="close-button" onclick="history.back()">×</button>
        
        <h2>Details for ${site.Sites}</h2>
        <div class="detail-item"><strong>Site:</strong> ${site.Sites}</div>
        <div class="detail-item"><strong>Name:</strong> ${site.Name}</div>
        <div class="detail-item"><strong>Address:</strong> ${site.Address}</div>
        <a href="${mapsUrl}" target="_blank" class="map-button">Open Google Maps</a>
        
        <div class="detail-item"><strong>Devices:</strong> ${site.Devices.replace(/\n/g, '<br>')}</div>
        
        <div class="detail-item"><strong>Other Details:</strong> ${site['Other Details'].replace(/\n/g, '<br>')}</div>
        
        <div class="detail-item"><strong>Coordinates:</strong> ${site.Latitude}, ${site.Logitude}</div>
        
        <button onclick="history.back()" class="map-button" style="background-color: #6c757d;">Back to List</button>
    `;
}

// 5. Go back to the main list view
function goBackToList() {
    // This function is now only called from the manual buttons, so we use history.back()
    // The history listener (onpopstate) handles the actual rendering.
    history.back(); 
}

// NEW: History Management Setup
function initHistory() {
    // Set the initial state (List View) so we have a known state to return to.
    history.replaceState(LIST_STATE, 'Site List', window.location.pathname);

    // Listen for the back/forward button presses (the core fix)
    window.onpopstate = function(event) {
        // If the state is null or the list state, render the list view.
        if (!event.state || event.state.view === 'list') {
            renderListAndShowSearch();
        } 
        // Note: If event.state.view was 'details', navigating back naturally loads the 'list' state.
        // We don't need to manually close the app, the back button will do it when history is empty.
    };
}


// Initialize listeners
function init() {
    // Set up the auto-filter listener (fires on every keystroke)
    searchInput.addEventListener('input', filterSites); 

    // NEW: Set up History API listener
    initHistory();
    
    // Load the data
    loadSites();
}

// Start the application
init();