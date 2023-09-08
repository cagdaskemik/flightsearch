<script lang="ts">
    // <!-- Results.svelte -->

    import { searchFlights } from "../api/mock";
    import ListedFlightDetail from "./ListedFlightDetail.svelte";
    import type { FlightSearchCriteria, Flight } from "../api/mock";
    // @ts-ignore
    import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
    import { fade } from "svelte/transition";

    export let searchInput: FlightSearchCriteria;
    let departureFlights: Flight[] = [];
    let returnFlights: Flight[] = [];
    let isLoading = false;
    let sortType = "unsorted";
    let originalFlights: Flight[] = [];

    $: fetchFlights(searchInput);

    async function fetchFlights(criteria: FlightSearchCriteria) {
        try {
            isLoading = true;
            const allFlights = await searchFlights(criteria);
            if (criteria.returnDate) {
                departureFlights = allFlights.filter(
                    (f) => f.type === "departure"
                );
                returnFlights = allFlights.filter((f) => f.type === "return");
            } else {
                departureFlights = allFlights;
                returnFlights = [];
            }
            originalFlights = [...departureFlights, ...returnFlights];
        } catch (error) {
            console.error("Error fetching flights:", error);
        } finally {
            isLoading = false;
        }
    }

    function sortByPrice(a: Flight, b: Flight): number {
        return a.price - b.price;
    }

    function sortByDepartureTime(a: Flight, b: Flight): number {
        const [hourA, minA] = a.departureTime.split(":").map(Number);
        const [hourB, minB] = b.departureTime.split(":").map(Number);
        return hourA * 60 + minA - (hourB * 60 + minB);
    }

    function sortByDuration(a: Flight, b: Flight): number {
        const convertDurationToMinutes = (duration: string) =>
            duration
                .split(" ")
                .map((part, idx) =>
                    idx === 0
                        ? Number(part.slice(0, -1)) * 60
                        : Number(part.slice(0, -1))
                )
                .reduce((acc, curr) => acc + curr, 0);

        return (
            convertDurationToMinutes(a.duration) -
            convertDurationToMinutes(b.duration)
        );
    }

    function handleSortChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        switch (
            value //add also returnFlights sort assign
        ) {
            case "price":
                departureFlights = departureFlights.sort(sortByPrice);
                returnFlights = returnFlights.sort(sortByPrice);
                break;
            case "departureTime":
                departureFlights = departureFlights.sort(sortByDepartureTime);
                returnFlights = returnFlights.sort(sortByPrice);
                break;
            case "duration":
                departureFlights = departureFlights.sort(sortByDuration);
                returnFlights = returnFlights.sort(sortByPrice);
                break;
            case "unsorted":
                departureFlights = originalFlights.filter(
                    (f) => f.type === "departure"
                );
                returnFlights = originalFlights.filter(
                    (f) => f.type === "return"
                );
                break;
        }
        sortType = value;
    }

    let showDepartureFlights = true;
    let showReturnFlights = true;

    function toggleDepartureFlights() {
        showDepartureFlights = !showDepartureFlights;
    }

    function toggleReturnFlights() {
        showReturnFlights = !showReturnFlights;
    }
</script>

{#if isLoading}
    <div class="loading">
        <LottiePlayer
            src="https://lottie.host/b3ec594e-8508-4367-8e11-df859bc92eb1/ivyuKiL58m.json"
            autoplay={true}
            loop={true}
            width={500}
            height={200}
            background="transparent"
            controls={false}
            controlsLayout={null}
        />
    </div>
{:else if originalFlights.length === 0}
    <div class="d-flex justify-content-center">
        No flights found ☹️ <br /> P.S On 29th of October, there are lots of
        outbound flights from IST for national holiday
        <span class="flag">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="12"
                viewBox="0 -30000 90000 60000"
            >
                <title>Flag of Turkey</title>
                <path fill="#e30a17" d="m0-30000h90000v60000H0z" />
                <path
                    fill="#fff"
                    d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z"
                />
            </svg>
        </span>
    </div>
{:else}
    <div class="sort-container">
        <select bind:value={sortType} on:change={handleSortChange} class="sort">
            <option value="unsorted">Sort by ... </option>
            <option value="price">Sort by Price</option>
            <option value="departureTime">Sort by Departure Time</option>
            <option value="duration">Sort by Flight Duration</option>
        </select>
    </div>

    <button
        class="btn btn-primary toggle shadow-none"
        on:click={toggleDepartureFlights}
        style="background-color: {showDepartureFlights ? '#ddd' : ''};"
    >
        {showDepartureFlights
            ? "🔼 Hide Departure Flights 🔼"
            : "▼ Show Departure Flights ▼"}
    </button>
    {#if showDepartureFlights}
        <div transition:fade={{ delay: 10, duration: 150 }}>
            {#each departureFlights as flight}
                <ListedFlightDetail {flight} />
            {/each}
        </div>
    {/if}

    <button
        class="btn btn-primary toggle shadow-none"
        on:click={toggleReturnFlights}
        style="background-color: {showReturnFlights
            ? '#ddd'
            : ''}; display: {searchInput.returnDate == '' ? 'none' : ''};"
    >
        {showReturnFlights
            ? "🔼 Hide Return Flights 🔼"
            : "▼ Show Return Flights ▼"}
    </button>
    {#if showReturnFlights}
        <div transition:fade={{ delay: 10, duration: 150 }}>
            {#each returnFlights as flight}
                <ListedFlightDetail {flight} />
            {/each}
        </div>
    {/if}
{/if}

<style>
    .flag {
        margin-top: 20px;
        margin-left: 2px;
    }
    .toggle {
        color: black;
    }
    .sort-container {
        display: flex;
        justify-content: flex-end;
        padding-right: 2px;
    }
    .sort {
        padding-right: 0;
        position: relative;
        display: flex;
    }
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 9999;
    }
    @media (max-width: 760px) {
        .loading {
            height: 100vh;
            width: 100vw;
            position: fixed;
        }
    }
</style>
