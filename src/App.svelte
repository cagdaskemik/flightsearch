<script lang="ts">
    import ListedFlightDetail from './components/ListedFlightDetail.svelte';
    import SearchBox from './components/SearchBox.svelte';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import Results from './components/Results.svelte';
    import type { FlightSearchCriteria } from "./api/mock";
  
    let searchInput: FlightSearchCriteria | null = null;
  
    let searchKey = 0; 
    function handleSearchParams(event: CustomEvent<FlightSearchCriteria>) {
        searchInput = event.detail;
        console.log(searchInput);
    }
  </script>
  
  <SearchBox on:searchParams={handleSearchParams} />
  
  {#if searchInput}
      <Results {searchInput} />
  {/if}
  