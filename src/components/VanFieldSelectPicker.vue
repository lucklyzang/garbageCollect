<template>
  <div>
    <van-field
      v-model="result"
      ref="currentField"
      v-bind="$attrs"
      @click="show = !show"
    />
    <van-popup v-model="show" position="bottom">
      <van-picker
        :columns="columns"
        show-toolbar
        :title="$attrs.label"
        @cancel="onCancle"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  model: {
    prop: "selectValue"
  },
  props: {
    columns: {
      type: Array
    },
    selectValue: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      result: this.selectValue
    };
  },
  mounted () {
  },
  methods: {
    onConfirm(value) {
      this.result = value;
      this.show = !this.show;
    },
    onCancle () {
      this.show = !this.show;
      this.$refs['currentField'].focus()
    }
  },
  watch: {
    selectValue: function(newVal) {
      this.result = newVal;
    },
    result(newVal) {
      this.$emit("input", newVal);
    }
  }
};
</script>
<style lang='less' scoped>