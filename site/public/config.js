// config.js - Change this file to adapt to ANY database

const CONFIG = {
    // Site metadata
    site: {
        title: "Business Search Directory",
        searchPlaceholder: "Search database...",
    },

    page: {
        landing: "Business Directory",
        search: "Business Search Directory",
        data: "Business Directory - Open Database",
    },

    // API endpoints
    api: {
        baseUrl: "/api",
        searchEndpoint: "/search",
        dataEndpoint: "/data"
    },

    //API and UI collection ids
    data: {
        collectionKey: "businesses",
        dom: {
            totalCountId: "businesses"
        }
    },

    // Database fields configuration
    fields: {
        // Primary display field (required)
        primary: {
            key: "name",
            label: "Name",
            type: "text",
            searchable: true,
            displayInCard: true,
            displayInList: true,
        },

        // Additional fields
        secondary: [
            {
                key: "address",
                label: "Address",
                type: "text",
                searchable: true,
                displayInCard: true,
                displayInList: true,
            },
            {
                key: "category",
                label: "Category",
                type: "select",
                searchable: false,
                displayInCard: true,
                displayInList: true,
                options: [
                    { value: "", label: "All Categories" },
                    { value: "Restaurant", label: "Restaurant" },
                    { value: "Cafe", label: "Cafe" },
                    { value: "Hotel", label: "Hotel" },
                    { value: "Retail", label: "Retail" },
                    { value: "Services", label: "Services" },
                    { value: "Bar: ", label: "Bar" },
                    { value: "Event Venue", label: "Event Venue" }
                ]
            },
            {
                key: "price_range",
                label: "Price Range",
                type: "select",
                searchable: false,
                displayInCard: true,
                displayInList: true,
                options: [
                    { value: "", label: "Any Price" },
                    { value: "$", label: "$ - Budget" },
                    { value: "$$", label: "$$ - Moderate" },
                    { value: "$$$", label: "$$$ - Upscale" },
                    { value: "$$$$", label: "$$$$ - Premium" }
                ]
            },
            {
                key: "average_rating",
                label: "Minimum Rating",
                type: "select",
                searchable: false,
                displayInCard: true,
                displayInList: false,
                formatter: (value) =>
                    value ? `${value.min.toFixed(1)}–${value.max.toFixed(1)}` : "",
                options: [
                    { value: "", label: "Any Rating" },
                    { value: { min: 2.0, max: 2.99 }, label: "2+" },
                    { value: { min: 3.0, max: 3.99 }, label: "3+" },
                    { value: { min: 4.0, max: 5.0 }, label: "4+" }
                ]
            },
            {
                key: "ai_description",
                label: "Description",
                type: "text",
                searchable: true,
                displayInCard: true,
                displayInList: false,
                multiline: true
            },
            {
                key: "latitude",
                label: "Latitude",
                type: "number",
                searchable: false,
                displayInCard: false,
                displayInList: false,
                pairedWith: "longitude" // For map links
            },
            {
                key: "longitude",
                label: "Longitude",
                type: "number",
                searchable: false,
                displayInCard: false,
                displayInList: false
            }
        ]
    },

    // Display options TODO: OpenStreetMap satellite integration
    display: {
        showRawJson: true,           // Show JSON data view
        resultsPerPage: 50,
        showResultCount: true,
        cardLayout: "grid",          // "grid" or "list"
        enableMapLinks: true,        // Show "View on Map" if lat/lng available
        enableDebounce: true,
        debounceDelay: 300          // ms
    },

    theme: "default"  
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}