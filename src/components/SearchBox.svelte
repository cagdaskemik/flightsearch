<!-- searchbox.svelte -->

<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from "svelte";
    import { getCities } from "../api/mock";
    import type { Airport, FlightSearchCriteria } from "../api/mock";
    import DatePicker from "svelty-picker";

    const dispatch = createEventDispatcher();
    let departureDropdown: HTMLUListElement;
    let arrivalDropdown: HTMLUListElement;
    let value: string = "";
    let matchedDepartureCities: Airport[] = [];
    let matchedArrivalCities: Airport[] = [];
    let isRange: boolean = true;
    let departureCity: string = "";
    let arrivalCity: string = "";
    let departureDate: string = "";
    let returnDate: string = "";
    let citiesList: string[] = [];

    async function searchCity(type: "departure" | "arrival") {
        try {
            const inputQuery =
                type === "departure" ? departureCity : arrivalCity;
            const cities = await getCities(inputQuery);

            if (type === "departure") {
                matchedDepartureCities = cities;
            } else {
                matchedArrivalCities = cities;
            }
        } catch (error) {
            console.error(error);
        }
    }

    function selectCity(city: Airport, type: "departure" | "arrival") {
        if (type === "departure") {
            departureCity = city.city;
            matchedDepartureCities = [];
        } else if (type === "arrival") {
            arrivalCity = city.city;
            matchedArrivalCities = [];
        }
        //matchedCities = []; // clear matched cities after selection
    }

    function isValidSearch(): boolean {
        dispatch("searchParams", null);
        if (!citiesList.includes(departureCity)) {
            alert("Please select a valid departure city.");
            return false;
        }
        if (!citiesList.includes(arrivalCity)) {
            alert("Please select a valid arrival city.");
            return false;
        }

        if (!departureDate) {
            alert("Please select a departure date.");
            return false;
        }

        if (isRange && !returnDate) {
            console.log(returnDate + " " + isRange);
            alert("Please select a return date.");
            return false;
        }
        return true;
    }

    function setSearchParams() {
        if (isValidSearch()) {
            const criteria: FlightSearchCriteria = {
                departureCity,
                arrivalCity,
                departureDate,
                returnDate,
            };
            dispatch("searchParams", criteria);
        }
    }

    function toggleDatepicker() {
        // Reset the datepicker when switching between one-way and two-way trips
        value = "";
        departureDate = "";
        returnDate = "";
        isRange = !isRange;
    }

    function handleOutsideClick(event: MouseEvent) {
        const targetNode = event.target as Node;

        if (
            departureDropdown &&
            !departureDropdown.contains(targetNode) &&
            targetNode !== departureDropdown.previousElementSibling
        ) {
            matchedDepartureCities = [];
        }
        if (
            arrivalDropdown &&
            !arrivalDropdown.contains(targetNode) &&
            targetNode !== arrivalDropdown.previousElementSibling
        ) {
            matchedArrivalCities = [];
        }
    }

    onMount(async () => {
        try {
            const cities = await getCities("");
            citiesList = cities.map((city) => city.city);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    });

    onMount(() => {
        // Other logic you have inside onMount...

        document.addEventListener("click", handleOutsideClick);

        return () => {
            // This will run when the component is destroyed
            document.removeEventListener("click", handleOutsideClick);
        };
    });

    $: {
        if (departureCity && matchedDepartureCities.length > 0) {
            departureDropdown.style.right = "0";
            departureDropdown.style.opacity = "1";
        } else if (departureDropdown) {
            departureDropdown.style.right = "-300px";
            departureDropdown.style.opacity = "0";
        }

        if (arrivalCity && matchedArrivalCities.length > 0) {
            arrivalDropdown.style.right = "0";
            arrivalDropdown.style.opacity = "1";
        } else if (arrivalDropdown) {
            arrivalDropdown.style.right = "-300px";
            arrivalDropdown.style.opacity = "0";
        }
    }

    $: {
        if (value) {
            const [start, end] = value.toString().split(",");
            departureDate = start;

            if (end) {
                returnDate = end;
            } else {
                returnDate = ""; // Resetting returnDate for one-way trips
            }
        }
    }
</script>

<div class="nav-container ps-4 pe-5">
    <b class="welcome"
        ><b class="logo">&nbsp;a&nbsp;</b>simple mock <br /> flight search app
    </b>
    <div class="left-container">
        <div class="search-box">
            <input
                class="form-control me-5"
                bind:value={departureCity}
                on:input={() => searchCity("departure")}
                placeholder="Departure From (city , airport code...)"
            />
            <ul
                class="city-dropdown departure-dropdown"
                bind:this={departureDropdown}
            >
                {#each matchedDepartureCities as city}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li on:click={() => selectCity(city, "departure")}>
                        <div class="city-item">
                            <span class="city-title"
                                >{city.city} ({city.code})</span
                            >
                            <span class="country-detail"
                                >{city.country} ({city.countrycode})</span
                            >
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="search-box">
            <input
                class="form-control me-5"
                bind:value={arrivalCity}
                on:input={() => searchCity("arrival")}
                placeholder="Destination To (city , airport code...)"
            />
            <ul
                class="city-dropdown arrival-dropdown"
                bind:this={arrivalDropdown}
            >
                {#each matchedArrivalCities as city}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                    <li on:click={() => selectCity(city, "arrival")}>
                        <div class="city-item">
                            <span class="city-title"
                                >{city.city} ({city.code})</span
                            >
                            <span class="country-detail"
                                >{city.country} ({city.countrycode})</span
                            >
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
        <DatePicker
            autocommit={true}
            {isRange}
            bind:value
            placeholder="Please select a date"
            format="dd-mm-yyyy"
            startDate={new Date()}
        />
        <button class="btn btn-primary btn-sm" on:click={toggleDatepicker}>
            <b>{isRange ? "Two Way Trip" : "One Way Trip"}</b>
        </button>
    </div>
    <button class="btn btn-primary spaced" on:click={setSearchParams}
        >Search Flights</button
    >
</div>

<style>
    .welcome {
        font-family: sans-serif;
        padding-right: 10px;
        color: white;
    }
    .logo {
        background: white;
        color: #0074e4;
        margin-right: 2px;
    }
    .nav-container {
        position: sticky;
        top: 0;
        background: linear-gradient(to bottom, #0074e4, #ddd);
        padding: 16px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1;
    }

    .left-container {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap; /* Items will wrap to the next line if there's not enough space */
        flex: 1; /* Ensures it takes up the maximum width possible before the search button */
        width: 80%;
    }

    .form-control {
        flex: 1; /* Allows the search input to expand */
        min-width: 250px; /* Ensures a minimum size for the search input */
    }

    .city-dropdown {
        position: absolute;
        top: 100%; /* Positions dropdown right below the input box */
        right: -300px; /* Start position outside of view */
        width: 250px; /* Set a fixed width or whatever suits your design */
        background-color: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for aesthetics */
        z-index: 1337; /* High value to ensure dropdown is above other elements */
        transition: right 0.3s, opacity 0.3s; /* Animation for sliding in and fading */
        opacity: 0; /* Initially set to invisible */
    }

    .departure-dropdown {
        position: absolute;
        top: 100%; /* Positions dropdown right below the departure input box */
        right: -300px; /* Start position outside of view */
        width: 250px;
        background-color: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1337; /* High value to ensure dropdown is above other elements */
        transition: right 0.3s, opacity 0.3s;
        opacity: 0; /* Initially set to invisible */
    }

    .arrival-dropdown {
        position: absolute;
        top: 100%; /* Positions dropdown right below the arrival input box */
        right: -300px; /* Start position outside of view */
        width: 250px;
        background-color: #fff;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1338; /* Slightly higher z-index to ensure it appears on top if both dropdowns are open */
        transition: right 0.3s, opacity 0.3s;
        opacity: 0;
    }

    .search-box {
        position: relative; /* Parent needs to be positioned relative for absolute positioning of child elements */
    }

    .city-item {
        padding: 8px 12px;
        border-bottom: 1px solid #eee; /* Provides separation between items */
        cursor: pointer; /* Indicates the items are clickable */
        transition: background-color 0.2s; /* Smoothens the hover effect */
    }

    .city-item:hover {
        background-color: #f5f5f5; /* Provides a hover effect to the items */
    }

    .city-title {
        font-size: 16px;
        color: black;
        display: block; /* Makes the city name and code appear on a new line */
    }

    .country-detail {
        font-size: 12px;
        color: gray;
        display: block; /* Makes the country name and code appear on a new line */
    }

    @media (max-width: 550px) {
        .nav-container {
            display: inline-block;
        }

        .spaced {
            margin-top: 10px;
        }
    }
</style>
