<script lang="ts">
    import type { Flight } from "../api/mock";
    export let flight: Flight;
    import { fade } from "svelte/transition";

    let showDetails = false;

    function toggleDetails() {
        showDetails = !showDetails;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="flight-card" on:click={toggleDetails}>
    <div>
        <div class="flight-details">
            <p>
                From: <strong> {flight.from} </strong><span
                    >({flight.departureTime})</span
                >
            </p>
            <p>
                To: <strong> {flight.to} </strong><span
                    >({flight.arrivalTime})</span
                >
            </p>
        </div>
    </div>
    {#if showDetails}
        <div transition:fade={{ delay: 0, duration: 150 }}>
            <div class="show-details">
                <h3>{flight.airline}</h3>
                <p>Duration: {flight.duration}</p>
                <p>Departure Date: {flight.departureDate}</p>
                <p>Arrival Date: {flight.arrivalDate}</p>
            </div>
        </div>
    {/if}

    {#if !showDetails}
        <div class="price">
            Price: ${flight.price}
        </div>
    {/if}

    {#if showDetails}
        <div class="price">
            Price: ${flight.price}
        </div>
    {/if}

    <div class="click-arrow">
        <span>{showDetails ? "⬆" : "⬇"}</span>
         <p class="click-text">
            {showDetails ? "Hide details" : "Show details"}
        </p>
    </div>
</div>

<style>
    .flight-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #ccc;
        padding: 10px;
        padding-right: 50px;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
    }
    .flight-details {
        color: grey;
    }
    .flight-details strong {
        color: black;
    }
    .price {
        font-weight: bold;
    }
    .click-arrow {
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 20px;
        align-items: center;
        gap: 5px;
        display: flex;
    }
    .click-text {
        font-size: 10px; /* Very small text */
        margin-bottom: 0;
        margin-top: 4px;
    }
    .show-details {
        border-top: 1px solid #ccc;
        margin-top: 10px;
        padding-top: 10px;
        margin-bottom: 30px;
    }
</style>
