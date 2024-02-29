#### 0.6.5 (2024-02-29)

##### Chores

*  clean ([8095e3df](https://github.com/da-z/llamazing/commit/8095e3df755a279e16a0cd9929fb87b9c9d84a61))
*  format ([54bbc258](https://github.com/da-z/llamazing/commit/54bbc2585dd85cc2b748aafba1c40b4ac1002dfd))
*  update release-tauri.yml ([b3eb13ef](https://github.com/da-z/llamazing/commit/b3eb13ef1baeb3d5e31ce7ecec5b1b4cfc136513))

##### New Features

*  use local storage for previous messages ([c929b9f3](https://github.com/da-z/llamazing/commit/c929b9f337c2b9ba864f79b6d066de5c1eccc990))

##### Bug Fixes

*  prev state is empty ([28f428aa](https://github.com/da-z/llamazing/commit/28f428aace1dcdeed2848ca1c2e387d607a16115))

#### 0.6.4 (2024-02-23)

##### Chores

*  format ([fe15ced3](https://github.com/da-z/llamazing/commit/fe15ced3a061d933efe34eaf4c1b62917a4af632))
*  send context (local time, etc) only if system prompt enabled ([626c7430](https://github.com/da-z/llamazing/commit/626c74300fa5abbfe1a73a00748e6154ba39c2f6))
*  SEO ([539946ed](https://github.com/da-z/llamazing/commit/539946edbd341fd648b4e1e0e608626c2a42e7fc))
*  small refactor ([1d658c55](https://github.com/da-z/llamazing/commit/1d658c55a55943334b963357dba739a925ecf165))

##### New Features

*  make "add context" a setting (defaults to false) ([61c42325](https://github.com/da-z/llamazing/commit/61c42325db12e072de51de7ad833840566516688))
*  nicer table headers ([1d9c548a](https://github.com/da-z/llamazing/commit/1d9c548ac98cc5c8142c0477849f0d80bac4c0b8))

##### Other Changes

*  web demo ([d4956a60](https://github.com/da-z/llamazing/commit/d4956a60263daf87ff8465041eb40316a9f2b8bd))

#### 0.6.3 (2024-02-15)

##### Chores

*  use localhost ([cbaa7f20](https://github.com/da-z/llamazing/commit/cbaa7f205ab0e229489a71fa29769af80af5b686))
*  bump deps ([7c343879](https://github.com/da-z/llamazing/commit/7c343879e21aee60970b138ef00c0a101149d066))

##### New Features

*  configurable Ollama URL ([9396ba3f](https://github.com/da-z/llamazing/commit/9396ba3f25faef96b6325ee3c9aad988ca09e577))

##### Bug Fixes

*  showSidePanel logic was inverted ([0713299c](https://github.com/da-z/llamazing/commit/0713299c9dae36bee76ac5976bddf66c1913f53f))
*  typo ([24b99223](https://github.com/da-z/llamazing/commit/24b992231da22989a27458ff8324e158e38b6135))

#### 0.6.2 (2024-02-13)

##### Chores

*  add alt ([ceb9f27b](https://github.com/da-z/llamazing/commit/ceb9f27bf92d239329e4922ea8fe965ceaae41dc))
*  clean-up - sidePanelShownRef not necessary ([4a6742fe](https://github.com/da-z/llamazing/commit/4a6742fe83d19cd69d4cb09213c438691ecd91bd))
*  clean-up hasCapability ([fc3de4dc](https://github.com/da-z/llamazing/commit/fc3de4dcfb0a7ab071d08eca83e956db5fcce4d3))
*  update ollama model based on what the rest api returns currently ([f1c05d70](https://github.com/da-z/llamazing/commit/f1c05d70a1a2cb2b38fcc9e5e287d2df4c8e84d3))

##### New Features

*  extract theme colors ([afe0871d](https://github.com/da-z/llamazing/commit/afe0871df38b354dbbdb72818962152b8c9b647b))

##### Bug Fixes

*  truncate long model names ([ea57dcfb](https://github.com/da-z/llamazing/commit/ea57dcfbb3fba696427c75e05a4976f61ccffe75))

#### 0.6.1 (2024-02-04)

##### Chores

*  bundle ollama-js license ([b69ec0a7](https://github.com/da-z/llamazing/commit/b69ec0a7348f4992750ecdb115679b39b5942aaf))
*  add license ([98cbd94f](https://github.com/da-z/llamazing/commit/98cbd94fd9a6c5a5d7ce861f2c05db5378804806))

##### New Features

*  show images inline ([6bb36d92](https://github.com/da-z/llamazing/commit/6bb36d92c8a25131ceb3c3280bf7ac38d92438db))
*  bundle fonts. now app can be used completely offline ([b725b27c](https://github.com/da-z/llamazing/commit/b725b27c6154384e167bce9a1c0ca506f65a2f0d))
*  improve model capability detection. refinements ([68d59b98](https://github.com/da-z/llamazing/commit/68d59b98b7f8c552a1a43330d35d1f661336fbc1))

##### Bug Fixes

*  do not send date and time to vision models. it confuses them it seems ([3809bcd3](https://github.com/da-z/llamazing/commit/3809bcd3fb350e3b00b7dca0032aabfb99e0f9ae))
*  removing a model from ollama crashes app on model refresh ([65d25a11](https://github.com/da-z/llamazing/commit/65d25a11645e1b458d12f1a325bb91619cac29d0))

#### 0.6.0 (2024-02-03)

##### Chores

*  enable native drag&drop ([c2da2051](https://github.com/da-z/llamazing/commit/c2da20512fe647769a6c9f1e9bea3597e20bbd18))
*  improve sys prompt format ([4ac07cfa](https://github.com/da-z/llamazing/commit/4ac07cfad4e12471a0bcfef45edc06d3ed10162c))
*  ignore changelog on format ([a007292f](https://github.com/da-z/llamazing/commit/a007292f260d9bbb1057a53ca34c7ffc10f3a5ce))
*  sync ollama js lib ([d50a033b](https://github.com/da-z/llamazing/commit/d50a033b74319374524ba677d444ec9ada837da5))
*  changelog ([709d6f94](https://github.com/da-z/llamazing/commit/709d6f94b3e3fec167b39ee8fb8e8758ef50b74f))
*  changelog ([69de32f2](https://github.com/da-z/llamazing/commit/69de32f2536eaa6b70ac809936ad47f1b6a96614))
*  improve code rendering ([564e3ad8](https://github.com/da-z/llamazing/commit/564e3ad86016f62a8e8f30e30928a10d85958ff1))

##### New Features

*  nicer image grid ([5b4ae379](https://github.com/da-z/llamazing/commit/5b4ae37978743fc187c7a0609976cadcaa289f1e))
*  vision prompts ([e4e264db](https://github.com/da-z/llamazing/commit/e4e264db536002787f5ad8f1016a31f4832c71e8))

#### 0.5.4 (2024-02-03)

##### New Features

*  improve code rendering (564e3ad8)
*  copy individual or complete history (click on first message) to clipboard. tweaks (c170f754)

##### Bug Fixes

*  fix for standalone app scroll glitch (848999da)

