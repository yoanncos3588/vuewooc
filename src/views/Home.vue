<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import SigninForm from "../components/SigninForm.vue";
import SignupForm from "../components/SignupForm.vue";
const catalogStore = useCatalog();

const res1 = catalogStore.fetchProducts();

// const res2 = catalogStore.fetchProductsByCategory(39);
</script>

<template>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mattis interdum sem ut porta. Suspendisse potenti. Aenean pharetra velit in efficitur
    vestibulum. Mauris cursus mauris id lacinia auctor. Fusce sit amet molestie dui. Ut ultricies nisl enim, id accumsan elit lobortis et. Sed sodales, felis
    nec cursus dignissim, lorem urna dapibus turpis, non bibendum ante nisl vel libero. Nam scelerisque neque sed dui commodo, id tempus diam pellentesque.
    Fusce sollicitudin est tortor, consequat commodo ipsum vulputate eu. Vestibulum sapien justo, molestie id metus et, commodo rhoncus turpis. Pellentesque
    dapibus tortor a nisl cursus, ac congue purus aliquam. In hac habitasse platea dictumst. Phasellus sit amet sodales nisl. Maecenas condimentum ornare tortor
    eu egestas. Vestibulum ultricies eros volutpat est feugiat hendrerit. Donec lectus purus, pretium id vehicula nec, luctus id quam. Sed tincidunt facilisis
    risus at lacinia. Curabitur dictum arcu odio, vel malesuada eros congue ultrices. Nam varius porta velit quis tristique. Vestibulum maximus arcu non laoreet
    aliquam. Cras ullamcorper ut enim at porta. Cras bibendum sagittis libero, ac imperdiet nisi egestas ut. Vivamus eu leo sodales, fermentum arcu mattis,
    porta eros. Integer in porta mauris, sit amet laoreet nulla. Etiam congue lectus ac lorem tincidunt malesuada. Mauris vel ligula dolor. Phasellus cursus,
    est eu vehicula dapibus, dolor enim porttitor ante, eget feugiat ligula nisi et augue. Quisque elementum condimentum ipsum. Etiam sed ex non leo maximus
    tempus vitae vel sapien. Vivamus scelerisque ultrices massa, sit amet consequat velit facilisis ut. In massa sapien, lacinia quis urna eu, fringilla aliquet
    eros. Mauris consectetur ipsum purus, in mattis justo accumsan vitae. Vestibulum fringilla, massa quis euismod rhoncus, ex nisl auctor nibh, et viverra
    turpis massa a leo. Morbi et feugiat libero. Aenean feugiat tempus sem, id vulputate mauris imperdiet id. Aenean at nunc elementum, facilisis erat sed,
    ullamcorper leo. Donec congue orci ipsum, consectetur mollis magna porttitor et. Integer sapien justo, tincidunt at mauris vitae, auctor ultrices purus. Ut
    venenatis dolor vel odio rutrum aliquam. Nunc nunc enim, imperdiet sit amet laoreet ac, sodales eu augue. Nullam et nibh quam. Nunc et sapien dictum,
    interdum enim ullamcorper, vestibulum lacus. Nam malesuada nibh nec turpis gravida imperdiet. Suspendisse at leo sit amet tortor scelerisque volutpat. Sed
    rutrum, nunc sit amet feugiat faucibus, lorem erat lobortis justo, et convallis nulla lacus sit amet neque. Maecenas pellentesque risus eget odio sagittis,
    ac egestas elit fringilla. Etiam non bibendum lorem, sit amet tincidunt nisl. Suspendisse et dui ut odio ornare tempor non in lectus. Etiam convallis
    ultricies sapien, sed imperdiet metus tincidunt vitae. Nunc finibus sapien ac mi laoreet tempor. Maecenas facilisis luctus dui, vitae faucibus lectus varius
    non. Nulla pellentesque vel velit in tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus.
  </p>
</template>
