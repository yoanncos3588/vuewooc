<template>
  <header>
    <div class="navbar is-light is-spaced">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item has-text-weight-bold is-uppercase is-size-4 has-text-info">
          <span class="has-text-primary">Vue</span>Wooc
        </RouterLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <form>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input type="text" class="input" placeholder="Rechercher un produit" />
              </div>
              <div class="control">
                <RouterLink to="/search" class="button is-primary">
                  <span class="icon is-small">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                </RouterLink>
              </div>
            </div>
          </form>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <!-- <RouterLink to="/signup" class="button">connexion / inscription</RouterLink> -->
              <div class="dropdown is-hoverable mr-4">
                <div class="dropdown-trigger">
                  <button class="button" aria-haspopup="true" aria-controls="auth-button">
                    <span>connexion / inscription</span>
                    <span class="icon is-small">
                      <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div class="dropdown-menu" id="auth-button" role="menu">
                  <div class="dropdown-content">
                    <div class="dropdown-item">
                      <span class="has-text-weight-bold is-block">Déjà client ?</span>
                      <RouterLink to="/login" class="button is-primary mt-2 is-block">Se connecter</RouterLink>
                    </div>
                    <hr class="dropdown-divider" />
                    <div class="dropdown-item">
                      <span class="has-text-weight-bold is-block">Nouveau client ?</span>
                      <RouterLink to="/signup" class="button is-primary mt-2 is-block">Créer un compte</RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <RouterLink class="button is-white" to="/cart">
                <span class="icon">
                  <i class="fa-solid fa-cart-shopping"></i>
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="has-background-info py-2 section">
      <nav class="is-flex buttons">
        <RouterLink to="/" class="button is-info"><strong>Menu 1</strong></RouterLink>
        <RouterLink to="/" class="button is-info"><strong>Menu 2</strong></RouterLink>
        <RouterLink to="/" class="button is-info"><strong>Menu 3</strong></RouterLink>
      </nav>
    </div>
  </header>
</template>
