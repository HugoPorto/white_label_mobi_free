import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"
import { useEffect } from "react"
import { Alert, PermissionsAndroid, Platform } from "react-native"

// Background message handler deve ser registrado fora do componente
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background message received:", remoteMessage)
})

export const usePushNotifications = () => {
  const requestPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )

      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        )

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Push notification permissions are not granted.")
          return false
        }
      }
    }

    const messagingInstance = messaging()
    const authStatus = await messagingInstance.requestPermission()
    const isAuthorized =
      authStatus === FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED ||
      authStatus === FirebaseMessagingTypes.AuthorizationStatus.PROVISIONAL

    if (!isAuthorized) {
      console.warn("Push notification permissions are not granted.")
    }
    return isAuthorized
  }

  const getToken = async () => {
    try {
      const messagingInstance = messaging()
      
      if (Platform.OS === "ios") {
        const apnsToken = await messagingInstance.getAPNSToken()
        if (!apnsToken) {
          console.warn("APNs token is null. Check APNs setup.")
          return
        }
        console.log("APNs Token:", apnsToken)
      }

      const fcmToken = await messagingInstance.getToken()
      console.log("FCM Token:", fcmToken)

      return fcmToken
    } catch (error) {
      console.error("Error fetching push notification token:", error)
    }
  }

  const handleForegroundNotification = () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message received:", remoteMessage)
      Alert.alert("New notification", JSON.stringify(remoteMessage.notification))
    })
    return unsubscribe
  }

  const handleBackgroundNotifications = () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Notification opened from background:", remoteMessage)
    })

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Notification opened from quit state:", remoteMessage)
        }
      })
  }

  useEffect(() => {
    ;(async () => {
      const hasPermission = await requestPermission()
      if (hasPermission) {
        await getToken()
      }
    })()

    handleBackgroundNotifications()
    const unsubscribe = handleForegroundNotification()

    return () => {
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    getToken
  }
}        