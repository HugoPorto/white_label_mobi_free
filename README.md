# white_label_mobi_free

## 📱 Visão Geral

O **white_label_mobi_free** é um aplicativo mobile de mobilidade urbana (estilo ride-hailing) construído com **React Native**.

Este projeto inclui uma estrutura modular para:
- autenticação e sessão de usuário;
- busca e solicitação de corridas;
- rastreamento e atualização em tempo real via socket;
- gerenciamento de documentos e perfil;
- integração com mapas, localização e notificações.

---

## 🧱 Stack Tecnológica

### Base
- React 19
- React Native 0.81
- Expo 54
- TypeScript

### Navegação e UI
- React Navigation (drawer, stack, native-stack)
- react-native-gesture-handler
- react-native-reanimated
- react-native-safe-area-context

### Rede e tempo real
- axios
- socket.io-client

### Recursos de dispositivo
- expo-location
- expo-image-picker
- expo-clipboard
- react-native-maps
- @react-native-firebase/app
- @react-native-firebase/messaging

### Arquitetura e utilitários
- awilix (injeção de dependência)
- async-storage
- netinfo

---

## 📂 Estrutura de Pastas (resumo)

```text
partiu_free/
├─ android/
├─ assets/
├─ data/
├─ di/
├─ docs/
├─ domain/
├─ presentation/
├─ App.tsx
├─ index.ts
└─ package.json
```

### Convenção sugerida
- `presentation/`: telas, componentes, navegação e estado de UI.
- `domain/`: regras de negócio, entidades e casos de uso.
- `data/`: chamadas HTTP, adapters, DTOs e repositórios.
- `di/`: container, bindings e factories.
- `docs/`: documentação técnica, fluxos e decisões arquiteturais.

---

## ✅ Pré-requisitos

- Node.js `>= 22.1.1`
- npm `>= 10.9.4`
- Java JDK usado `21.0.8`
- Android Studio + SDK Android 35
- Usar `npx`, Expo não funciona corretamente para algumas libs
- Conta Firebase para push notifications e armazenamento de imagens
- Conta Google Cloud com Maps SDK habilitado

---

## ⚙️ Instalação Local

### 1) Clonar o repositório

```bash
git clone https://github.com/FusionMobi/white_label_mobi_free
cd white_label_mobi_free
```

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar ambiente no app.json

Neste projeto, a configuração necessária nessa etapa é **somente** no arquivo `app.json`, nos campos:
- `expo.extra.googleMapsApiKey`
- `expo.android.permissions`

Exemplo baseado no formato atual do projeto:

```json
{
   "expo": {
      "extra": {
         "googleMapsApiKey": "SUA_CREDENCIAL_GOOGLE_API_KEY_AQUI"
      },
      "android": {
         "permissions": [
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_BACKGROUND_LOCATION",
            "android.permission.RECORD_AUDIO"
         ]
      }
   }
}
```

> Dica: mantenha a lista de permissões sem duplicidade.

### 4) Rodar o app

```bash
npx expo run:android
```
---

## 🔐 Configurações no app.json

| Campo | Obrigatório | Descrição |
|---|---|---|
| `expo.extra.googleMapsApiKey` | sim | Chave da Google Maps API usada no app |
| `expo.android.permissions` | sim | Permissões Android necessárias para funcionamento dos recursos |

---

## 🚀 Release

### Build local (APK)

```bash
cd android
./gradlew build
```

### Build release local (APK)

```bash
cd android
./gradlew assembleRelease
```

Saída esperada:
- `android/app/build/outputs/apk/release/app-release.apk`

---

## 🧩 Arquitetura

### Camadas
1. **Presentation**: telas, componentes e navegação.
2. **Domain**: casos de uso e regras centrais.
3. **Data**: comunicação com API/socket e persistência local.
4. **DI**: resolução de dependências e ciclo de vida dos serviços.

### Fluxo resumido
`UI -> UseCase -> Repository -> API/Socket -> State/UI`

---

## 🔄 Fluxo funcional básico

1. Usuário autentica.
2. App obtém localização atual.
3. Usuário informa destino.
4. App calcula rota e estimativa.
5. Solicitação enviada para backend.
6. Matching com motorista.
7. Atualizações em tempo real via socket.
8. Corrida finalizada e avaliação.

---

## 🧯 Troubleshooting

### Erro de build Android
- Verifique JDK 21.0.8 ativo.
- Limpe cache:

```bash
cd android
./gradlew clean
```

### App não conecta na API
- Confira `ApiRequestHandler.tsx`.

### Push não chega
- Verifique `google-services.json`.
- Confirme permissões de notificação no device.
- Revise token FCM no backend.

---

## 📄 Licença

Este projeto está licenciado sob a **Apache License 2.0**.

- Texto completo: [LICENSE](LICENSE)
- Link oficial: http://www.apache.org/licenses/LICENSE-2.0
