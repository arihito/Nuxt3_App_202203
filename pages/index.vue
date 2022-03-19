<script setup lang="ts">
const name = ref("松田");

useMeta({
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  ],
  bodyAttrs: {
    class: "test",
  },
});

const testFunc = () => {
  return "有人";
};

// サーバからの非同期
const { data } = useFetch("/api/hello");
console.log(data.value)

// 自身の関数定義を呼び出し
const foo = useFoo()
console.log(foo.value)

// 環境変数を呼び出し
const config = useRuntimeConfig()
console.log(config.APP_ENV)

</script>

<template>
  <div>
    {{ name }}{{ testFunc() }}{{ foo }}
    <AtomsTheButton name="送信ボタン" />
  </div>
</template>
