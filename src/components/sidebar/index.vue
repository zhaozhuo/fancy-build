<style lang="sass">
  @import "~fancy_style"

  $bg : #22282e
  $bg-hover: #414d5c
  $icon-color: #71808f

  .fancy-sidebar
    .fc-list
      &.fc-fold
        > div
          &::before
            transform: rotate(45deg) translate3d(0,-100%,0)
        > ul
          display: none

      > div
        height: $row-height
        line-height: $row-height
        padding-left: $form-height / 2
        position: relative
        font-weight: bolder
        cursor: pointer
        &:hover
          color: $colorTheme
        &::before
          content: ''
          position: absolute
          top: 50%
          left: 0
          height: $form-height / 8
          width: $form-height / 8
          border-top: 1px solid currentColor
          border-right: 1px solid currentColor
          transform-origin: center center
          transform: rotate(135deg) translate3d(-100%, 0, 0)

          transition: transform 0.2s ease-in

      > ul
        display: block
        position: relative
        &::before,
          content: ''
          position: absolute
          left: $form-height / 2
          top: 0
          bottom: $row-height / 2
          border-left: 1px dashed rgba($colorFont, 0.2)
        li
          height: $row-height
          line-height: $row-height
          padding-left: $form-height
          position: relative
          &:hover
            color: $colorTheme
          &::before
            content: ''
            position: absolute
            top: 50%
            left: $form-height / 2
            width: $row-height / 2
            border-top: 1px dashed rgba($colorFont,0.2)


    @media #{$device-mobile}
      > .fc-switch
        left: 10rem
      > .fc-list
        width: 0
        &.fc-slide


</style>

<template lang="pug">
  .fancy-sidebar
    .fc-switch
      span(class="fa fa-id-badge" @click="state = true")
    .fc-list(v-for="(v, k) in cfg.data",:class="{'fc-fold': folded[k], 'fc-slide': state}")
      div(@click="_toggle(k)") {{v.name}}
      ul
        li(v-for="item of v.items")
          a(:href="item.url") {{item.name}}
</template>

<script>
const Options = {
  data: null,
  active: "",
  onSlide(bool) {},
  callback(data) {}
};
export default {
  props: ["cfg"],
  data() {
    return {
      state: false,
      folded: {}
    };
  },
  created() {
    Object.keys(Options).forEach(
      i => this.cfg.hasOwnProperty(i) || this.$set(this.cfg, i, Options[i])
    );
    for (let i of Object.keys(this.cfg.data)) {
      this.$set(this.folded, i, this.folded[i] || false);
    }
    console.log(this.folded);
  },
  watch: {
    state(val) {
      this.cfg.onSlide(val);
    }
  },
  methods: {
    _setState() {
      this.state = !this.state;
      this.cfg.callback(this.state, this.folded);
    },
    _toggle(k) {
      console.log(k);
      this.folded[k] = !this.folded[k];
    }
  }
};
</script>

