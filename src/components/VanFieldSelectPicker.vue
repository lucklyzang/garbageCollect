<template>
  <div>
    <van-field
      v-model="result"
      ref="currentField"
      v-bind="$attrs"
      @click="formHandle"
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
    },

    // 表单点击事件
    formHandle () {
      this.show = !this.show;
      if (this.columns.length == 0) {
        this.$dialog.alert({
          message: '暂无历史回显数据可供选择,请手动输入',
          closeOnPopstate: true
        }).then(() => {
          this.$refs['currentField'].focus()
        });
        this.show = false;
      }
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