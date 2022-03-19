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


## [component](https://v3.nuxtjs.org/docs/directory-structure/components#components-directory)の連携

ボタンコンポーネントを作成しindex.vueにインポートする。

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

定義したコンポーネントをimportの式を書かずとも、いきなりテンプレートに記述できる。

```
<template>
  <div>
    {{ name }}{{ testFunc() }}
    <AtomsTheButton />
  </div>
</template>
```

## propsの渡し方

nameのpropsを子のコンポーネントに渡す。

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


## メタタグ

MetaTag https://v3.nuxtjs.org/docs/usage/meta-tags#meta-tags

各ページごとにメタ情報などで読み込ませていくことができる
useMeta({
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ],
      bodyAttrs: {
        class: 'test'
      }
    })

## useFetch https://v3.nuxtjs.org/docs/usage/data-fetching#usefetch
Axiosの代わりに非同期のAPIが実装できる

pages/index.vue

const { data } = useFetch('/api/hello', {
  method: 'POST',
  baseURL: 'https://xxx',
  params: {},
  body: {}
})

以下のdataが返ってくる

const {
  data: Ref<DataT>,
  pending: Ref<boolean>,
  refresh: (force?: boolean) => Promise<void>,
  error?: any
} = useFetch(url: string, options?)


オプションに様々な追加も可能

「ohmyfetch」からのオプション
method: Request method
params: Query params
headers: Request headers
baseURL: Base URL for the request

メソッド：リクエストメソッド
params：クエリパラメータ
ヘッダー：リクエストヘッダー
baseURL：リクエストのベースURL 


## サーバ指定

server/api/hello.ts
export default ({ req, res }) => 'Hello World'

index.vue
const { data } = useFetch('/api/hello')
console.log(data.value)


## Composabels
importしなくても直接この中で定義した関数を呼び出せる。
Vue2で使用していたmethodsの関数stateなどを一括管理できる

composables　　専用ディレクトリを作成
 | - useFoo.ts　直下のファイルがインポートが対象
 | - useBar　　　サブディレクトリを作成した場合は直下のindexしかインポートしない
 | --- supportingFile.ts
 | --- index.ts


composables/useFoo.ts
下記の場合fooで呼び出すとbarが表示される

export const useFoo = () => {
  return useState('foo', () => 'bar')
}

index.vue
const foo = useFoo()
console.log(foo.value)


## Plugin https://v3.nuxtjs.org/docs/directory-structure/plugins#plugins-directory

以前のNuxtは毎回プラグインの読み込みとimportが必要だったが定義するだけでよくなった

plugin/myPlugin.ts
export default defineNuxtPlugin(nuxtApp => {
  console.log('myPlugin')
})

APIの場合はcreatedの初回読み込みができるが、ローカルストレージは読み込めない。
ただPluginを使用するとクライアントかサーバー側
どちらで実行するかをファイル名にclientと付けることで定義できるようになった。
リダイレクト時に値が無ければローカルストレージから値が取れるようになる。

https://zenn.dev/coedo/articles/route-middleware-nuxt3

補足 : ライフサイクル（実行順序）

次のファイルがある場合の実行順序は次のとおり。

plugins/bar.server.ts サーバー側のレンダリング時に1度だけ
plugins/baz.client.ts クライアント側のレンダリング時に1度だけ(ローカルストレージから値がとれる)
middleware/foo.ts Pageコンポーネントの読み込みごと（ページ遷移の前）
Page Component: setup <script setup> 等

## nuxt.config.js

環境変数の追加が可能。APIの呼び出しでよく使用する
publicはクライアント(ブラウザ)で呼び出すことが可能
privareはサーバのみで呼び出すことが可能

export default defineNuxtConfig({
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV
  },
  privateRuntimeConfig: {
    API_SECRET: process.env.APP_SECRET
  }
})

.env
APP_ENV=dev
API_SECRET=password

index.vue
まとめてconfig内に呼び出し
const config = useRuntimeConfig()

## TypeScript

types/ApiTypes.ts
export type GetUserApi = {
  AccessToken: String
}

※認証関連でAWSの連携が必要になってきている。
https://www.ragate.co.jp/blog/articles/684
