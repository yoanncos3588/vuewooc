<template>
  <header class="navbar navbar-expand-lg">
    <!-- <nav class="navbar navbar-expand-lg bg-body-tertiary w-100">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">WoocSHOP</RouterLink>

        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offCanvasNav"
          aria-controls="offCanvasNav"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="offCanvasNav" class="offcanvas offcanvas-end" aria-labelledby="offCanvasNavLabel">
          <div class="offcanvas-body">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a href="#" class="nav-link">Link 1</a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">Link 2</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav> -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <a class="navbar-brand" href="#">Offcanvas navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#navbarOffcanvasLg"
        aria-controls="navbarOffcanvasLg"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="navbarOffcanvasLg" aria-labelledby="navbarOffcanvasLgLabel">
        <ul>
          <li>or</li>
          <li>nz</li>
          <li>nzef</li>
        </ul>
      </div>
    </nav>
  </header>
</template>
