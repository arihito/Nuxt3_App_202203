# Nuxt3

[ドキュメント](https://v3.nuxtjs.org/getting-started/introduction)

現在はbeta版のため、あまりパッケージが対応してないことが多く、機能追加が難しい。2022年6月からstable(安定版)が出ることによって、各パッケージ群が対応してくるため2023年ころから標準的な開発が行えるようになてくる。
[Nuxt3現在のリリース予定状況](https://v3.nuxtjs.org/community/roadmap#current-releases)

[VeeValidate](https://qiita.com/TakahiRoyte/items/843bc5da2732703de1a3)はバリデーション判定に使えるパッケージとして早めにリリースされている。


## nuxtプロジェクトの[初期化](https://v3.nuxtjs.org/getting-started/installation)

```
$ npx nuxi init nuxt3-app
$ yarn
$ yarn run dev 
```

## 基本的な簡略記法

- app.vue
```
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

```
$ mkdir pages
$ touch pages/index.vue
```

Nuxtの場合はscriptを上に記述する

```
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent ({
  setup() {
    const name = ref('松田')

    const testFunc = () => {
      return '有人'
    }

    return {
      name,
      testFunc
    }
  }
})
</script>

<template>
  <div>
    {{ name }}{{ testFunc() }}
  </div>
</template>
```

**setup**をscriptの開始タグに含めることでdefineComponentのexportやプロパティのreturnなど省略できる。
ただし、自由に書きやすくなった反面、自身の管理が必要になっている。
また、現状ではVSCodeなどのエディタが未対応のため赤くエラー表示されてしまう。

リアクティブデータに関しては、refでもオブジェクトが使え、
かつreactiveは値の受け渡しに制限(バグ)があるためrefを使用するのが一般的

```
<script setup lang="ts">
const name = ref<String>('松田')

const testFunc = () => {
  return '有人'
}
</script>
```

Vue3はcreatedは廃止され、script直下に関数を定義すれば描画時に実行される。
mountedはonMonutedに名称が変わった。

```
onMounted(() => {
  conslole.log()
})
```


## [コンポーネント](https://v3.nuxtjs.org/docs/directory-structure/components#components-directory)の連携

部品となるボタンコンポーネントを作成しindex.vueにインポートする。

```
$ mkdir -p components/atoms
$ touch components/atoms/TheButton.vue
```
```
<template>
  <button>
    ボタン
  </button>
</template>
```

定義したコンポーネントをimportの式を書かずとも、いきなりテンプレートにパスを含めてアッパーキャメルケースで記述できる。

```
<template>
  <div>
    {{ name }}{{ testFunc() }}
    <AtomsTheButton />
  </div>
</template>
```

## [プロップス](https://v3.nuxtjs.org/docs/usage/nuxt-link#props)の渡し方

nameの**props**を子のコンポーネントに渡す。

```
<AtomsTheButton name="送信ボタン" />
```

- 以前の方法

```
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup(props) {
    return {
      props
    }
  }
})
</script>
<template>
  <button>
    {{ props.name }}
  </button>
</template>
```

- setupでの省略指定

definePropsの初期値に制約を指定することで、そのままpropsが参照できる。

```
<script setup lang="ts">
const props = defineProps({
  name: String
})
</script>
```


## [メタタグ](https://v3.nuxtjs.org/docs/usage/meta-tags#meta-tags)

各ページごとにメタ情報など共通のコードを読み込ませていくことができる。

```
useMeta({
  meta: [
    { 
      name: 'viewport', 
      content: 'width=device-width, initial-scale=1, maximum-scale=1' 
    }
  ],
  bodyAttrs: {
    class: 'test'
  }
})
```

## [非同期処理](https://v3.nuxtjs.org/docs/usage/data-fetching#usefetch)

**useFetch**を使用することでAxiosの代わりに非同期のAPIが実装できる。

```
$ mkdir pages
$ touch pages/index.vue
```

```
const { data } = useFetch('/api/hello', {
  method: 'POST',
  baseURL: 'https://xxx',
  params: {},
  body: {}
})
```

以下のdataが返ってくる

```
const {
  data: Ref<DataT>,
  pending: Ref<boolean>,
  refresh: (force?: boolean) => Promise<void>,
  error?: any
} = useFetch(url: string, options?)
```

オプションに様々な機能追加も可能

「ohmyfetch」からのオプション
- method: Request method　リクエストメソッド
- params: Query params　クエリパラメータ
- headers: Request headers　リクエストヘッダー
- baseURL: Base URL for the request　リクエストのベースURL 


## [サーバ](https://v3.nuxtjs.org/docs/directory-structure/server#server-directory)

```
$ mkdir -p server/api
$ touch server/api/hello.ts
```

```
export default ({ req, res }) => 'Hello World'
```

- index.vue
```
const { data } = useFetch('/api/hello')
console.log(data.value)
```

## [関数の外部管理](https://v3.nuxtjs.org/docs/directory-structure/composables#composables-directory)

importしなくても直接**Composabels**の中で定義した関数を呼び出せる。
Vue2で使用していたmethodsと同様で、stateなどを一括管理するときに使用する。

```
composables　　専用ディレクトリを作成
 | - useFoo.ts　直下のファイルがインポートが対象
 | - useBar　　　サブディレクトリを作成した場合は直下のindexしかインポートしない
 | --- supportingFile.ts
 | --- index.ts
```

下記の場合fooで呼び出すとbarが表示される

```
$ mkdir composables
$ touch composables/useFoo.ts
```
```
export const useFoo = () => {
  return useState('foo', () => 'bar')
}
```

- index.vue
```
const foo = useFoo()
console.log(foo.value)
```


## [プラグイン](https://v3.nuxtjs.org/docs/directory-structure/plugins#plugins-directory)

以前のNuxtは毎回プラグインの読み込みとimportが必要だったが定義するだけでよくなった

```
$ mkdir plugin
$ touch plugin/myPlugin.ts
```
```
export default defineNuxtPlugin(nuxtApp => {
  console.log('myPlugin')
})
```

APIの場合はcreatedの初回読み込みができるが、その段階ではローカルストレージは読み込めない。
ただPluginを使用するとクライアントかサーバー側か、どちらで実行するかをファイル名で定義できるようになった。
例えば、リダイレクト時に必要な値が無い場合は、ローカルストレージから参照できるようになる。

ファイル名に応じてライフサイクルとなる実行順序が以下のように異なってにくる。

- plugins/bar.server.ts サーバー側のレンダリング時に1度だけ
- plugins/baz.client.ts クライアント側のレンダリング時に1度だけ(ローカルストレージから値がとれる)
- middleware/foo.ts Pageコンポーネントの読み込みごと（ページ遷移の前）

## [環境変数](https://v3.nuxtjs.org/docs/usage/runtime-config#environment-variables)

**nuxt.config.js**に環境変数の追加が可能。APIの呼び出しでよく使用する
publicはクライアント(ブラウザ)で呼び出すことが可能
privareはサーバのみで呼び出すことが可能

- nuxt.config.js
```
export default defineNuxtConfig({
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV
  },
  privateRuntimeConfig: {
    API_SECRET: process.env.APP_SECRET
  }
})
```

- .env
```
APP_ENV=dev
API_SECRET=password
```

まとめてconfig内に呼び出し

- index.vue
```
const config = useRuntimeConfig()
```

## [型指定](https://v3.nuxtjs.org/concepts/typescript#typescript)

全体にTypeScriptを使用することで、手数が増えるが安全な開発が行える。

```
$ mkdir types
$ touch types/ApiTypes.ts
```
```
export type GetUserApi = {
  AccessToken: String
}
```

## [AWS Amplify](https://www.ragate.co.jp/blog/articles/684)

AWSの連携しバックからフロントまでの認証の仕組みを提供することができる。
