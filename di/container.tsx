import { asClass, createContainer } from "awilix";
import { AuthService } from "../data/sources/remote/services/AuthService";
import { AuthRepositoryImpl } from "../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../domain/useCases/auth/LoginUseCase";
import { LoginViewModel } from "../presentation/screens/auth/login/LoginViewModel";
import { RegisterViewModel } from "../presentation/screens/auth/register/RegisterViewModel";
import { RegisterUseCase } from "../domain/useCases/auth/RegisterUseCase";
import { LocalStorage } from "../data/sources/local/LocalStorage";
import { SaveAuthSessionUseCase } from "../domain/useCases/auth/SaveAuthSessionUseCase";
import { GetAuthSessionUseCase } from "../domain/useCases/auth/GetAuthSessionUseCase";
import { RemoveAuthSessionUseCase } from "../domain/useCases/auth/RemoveAuthSessionUseCase";
import { AuthUseCases } from "../domain/useCases/auth/AuthUseCases";
import { GooglePlacesService } from "../data/sources/remote/services/GooglePlacesService";
import { GooglePlacesRepositoryImpl } from '../data/repository/GooglePlacesRepositoryImpl';
import { GetPlaceDetailsUseCase } from "../domain/useCases/googlePlaces/GetPlaceDetailsUseCase";
import { GooglePlacesUseCases } from "../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { ClientSerchMapViewModel } from "../presentation/screens/client/searchMap/ClientSearchMapViewModel";
import { GetPlaceDetailsByCoordsUseCase } from "../domain/useCases/googlePlaces/GetPlaceDetailsByCoordsUseCase";
import { GetDirectionsUseCase } from "../domain/useCases/googlePlaces/GetDirectionsUseCase";
import { ClientRequestService } from '../data/sources/remote/services/ClientRequestService';
import { ClientRequestRepositoryImpl } from "../data/repository/ClientRequestRepositoryImpl";
import { GetTimeAndDistanceUseCase } from "../domain/useCases/clientRequest/GetTimeAndDistanceUseCase";
import { ClientRequestUseCases } from "../domain/useCases/clientRequest/ClientRequestUseCases";
import { SocketService } from "../data/sources/remote/services/SocketService";
import { DriverMyLocationMapViewModel } from "../presentation/screens/driver/myLocationMap/DriverMyLocationMapViewModel";
import { UserService } from "../data/sources/remote/services/UserService";
import { UserRepositoryImpl } from "../data/repository/UserRepositoryImpl";
import { UpdateUserUseCase } from "../domain/useCases/user/UpdateUserUseCase";
import { UpdateImageUserUseCase } from "../domain/useCases/user/UpdateImageUserUseCase";
import { UserUseCases } from "../domain/useCases/user/UserUseCases";
import { ProfileUpdateViewModel } from "../presentation/screens/profile/update/ProfileUpdateViewModel";
import { CreateClientRequestUseCase } from "../domain/useCases/clientRequest/CreateClientRequestUseCase";
import { GetNearbyTripRequestUseCase } from "../domain/useCases/clientRequest/GetNearbyTripRequestUseCase";
import { DriverClientRequestViewModel } from "../presentation/screens/driver/clientRequest/DriverClientRequestViewModel";
import { DriverPositionService } from "../data/sources/remote/services/DriverPositionService";
import { DriverPositionRepositoryImpl } from "../data/repository/DriverPositionRepositoryImpl";
import { CreateDriverPositionUseCase } from "../domain/useCases/driverPosition/CreateDriverPositionUseCase";
import { DriverPositionUseCases } from "../domain/useCases/driverPosition/DriverPositionUseCases";
import { GetDriverPositionUseCase } from "../domain/useCases/driverPosition/GetDriverPositionUseCase";
import { DriverTripOfferService } from "../data/sources/remote/services/DriverTripOfferService";
import { DriverTripOfferRepositoryImpl } from "../data/repository/DriverTripOfferRepositoryImpl";
import { DriverTripOfferUseCases } from "../domain/useCases/driverTripOffer/DriverTripOfferUseCases";
import { CreateDriverTripOfferUseCase } from "../domain/useCases/driverTripOffer/CreateDriverTripOfferUseCase";
import { GetDriverTripOffersUseCase } from "../domain/useCases/driverTripOffer/GetDriverTripOffersUseCase";
import { UpdateDriverAssignedUseCase } from "../domain/useCases/clientRequest/UpdateDriverAssignedUseCase";
import { GetClientRequestByIdUseCase } from "../domain/useCases/clientRequest/GetClientRequestByIdUseCase";
import { ClientTripMapViewModel } from "../presentation/screens/client/tripMap/ClientTripMapViewModel";
import { DriverTripMapViewModel } from "../presentation/screens/driver/tripMap/DriverTripMapViewModel";
import { UpdateStatusUseCase } from "../domain/useCases/clientRequest/UpdateStatusUseCase";
import { UpdateDriverRatingUseCase } from "../domain/useCases/clientRequest/UpdateDriverRatingUseCase";
import { UpdateClientRatingUseCase } from "../domain/useCases/clientRequest/UpdateClientRatingUseCase";
import { DriverTripRatingViewModel } from "../presentation/screens/driver/tripRating/DriverTripRatingViewModel";
import { ClientTripRatingViewModel } from "../presentation/screens/client/tripRating/ClientTripRatingViewModel";
import { GetByClientAssignedUseCase } from "../domain/useCases/clientRequest/GetByClientAssignedUseCase";
import { GetByDriverAssignedUseCase } from "../domain/useCases/clientRequest/GetByDriverAssignedUseCase";
import { ClientTripHistoryViewModel } from "../presentation/screens/client/tripHistory/ClientTripHistoryViewModel";
import { DriverTripHistoryViewModel } from "../presentation/screens/driver/tripHistory/DriverTripHistoryViewModel";
import { UpdateNotificationTokenUseCase } from "../domain/useCases/user/UpdateNotificationTokenUseCase";
import { VehicleRequestRepositoryImpl } from "../data/repository/VehicleRepositoryImpl";
import { VehicleRequestUseCases } from "../domain/useCases/vehicleRequest/VehicleRequestUseCases";
import { CreateVehicleRequestUseCase } from "../domain/useCases/vehicleRequest/CreateVehicleRequestUseCase";
import { VehicleRegisterViewModel } from "../presentation/screens/vehicle/VehicleRegisterViewModel";
import { VehicleRequestService } from "../data/sources/remote/services/VehicleRequestService";
import { GetVehicleRequestByIdUserUseCase } from "../domain/useCases/vehicleRequest/GetVehicleRequestByIdUserUseCase";
import { BalanceService } from "../data/sources/remote/services/BalanceService";
import { BalanceRepositoryImpl } from "../data/repository/BalanceRepositoryImpl";
import { CreateBalanceUseCase } from "../domain/useCases/balance/CreateBalanceUseCase";
import { UpdateBalanceUseCase } from "../domain/useCases/balance/UpdateBalanceUseCase";
import { BalanceUseCases } from "../domain/useCases/balance/BalanceUseCases";
import { ChatViewModel } from "../presentation/screens/chat/ChatViewModel";
import { ChatService } from "../data/sources/remote/services/ChatService";
import { ChatRepositoryImpl } from "../data/repository/ChatRepositoryImpl";
import { ChatUseCases } from "../domain/useCases/chat/ChatUseCases";
import { ChatMessageCreateUseCase } from "../domain/useCases/chat/ChatMessageCreateUseCase";
import { GetActiveClientRequestUseCase } from "../domain/useCases/chat/GetActiveClientRequestUseCase";
import { BalanceViewModel } from "../presentation/screens/balance/BalanceViewModel";
import { GetMainVehicleByUserIdUseCase } from "../domain/useCases/vehicleRequest/GetMainVehicleByUserId";
import { DocumentsViewModel } from "../presentation/screens/vehicle/DocumentsViewModel";

const container = createContainer();

container.register({
    authService: asClass(AuthService).singleton(),
    googlePlacesService: asClass(GooglePlacesService).singleton(),
    localStorage: asClass(LocalStorage).singleton(),
    clientRequestService: asClass(ClientRequestService).singleton(),
    userService: asClass(UserService).singleton(),
    driverPositionService: asClass(DriverPositionService).singleton(),
    driverTripOfferService: asClass(DriverTripOfferService).singleton(),
    vehicleRequestService: asClass(VehicleRequestService).singleton(),
    balanceService: asClass(BalanceService).singleton(),
    chatService: asClass(ChatService).singleton(),
    socketService: asClass(SocketService).singleton(),
    authRepository: asClass(AuthRepositoryImpl).singleton(),
    googlePlacesRepository: asClass(GooglePlacesRepositoryImpl).singleton(),
    clientRequestRepository: asClass(ClientRequestRepositoryImpl).singleton(),
    userRepository: asClass(UserRepositoryImpl).singleton(),
    driverPositionRepository: asClass(DriverPositionRepositoryImpl).singleton(),
    driverTripOfferRepository: asClass(DriverTripOfferRepositoryImpl).singleton(),
    vehicleRequestRepository: asClass(VehicleRequestRepositoryImpl).singleton(),
    balanceRepository: asClass(BalanceRepositoryImpl).singleton(),
    chatRepository: asClass(ChatRepositoryImpl).singleton(),
    loginUseCase: asClass(LoginUseCase).singleton(),
    registerUseCase: asClass(RegisterUseCase).singleton(),
    saveAuthSessionUseCase: asClass(SaveAuthSessionUseCase).singleton(),
    getAuthSessionUseCase: asClass(GetAuthSessionUseCase).singleton(),
    removeAuthSessionUseCase: asClass(RemoveAuthSessionUseCase).singleton(),
    authUseCases: asClass(AuthUseCases).singleton(),
    getPlaceDetailsUseCase: asClass(GetPlaceDetailsUseCase).singleton(),
    getPlaceDetailsByCoordsUseCase: asClass(GetPlaceDetailsByCoordsUseCase).singleton(),
    getDirectionsUseCase: asClass(GetDirectionsUseCase).singleton(),
    googlePlacesUseCases: asClass(GooglePlacesUseCases).singleton(),
    getTimeAndDistanceUseCase: asClass(GetTimeAndDistanceUseCase).singleton(),
    vehicleRequestUseCases: asClass(VehicleRequestUseCases).singleton(),
    createVehicleRequestUseCase: asClass(CreateVehicleRequestUseCase).singleton(),
    getVehicleRequestByIdUserUseCase: asClass(GetVehicleRequestByIdUserUseCase).singleton(),
    getMainVehicleByUserIdUseCase: asClass(GetMainVehicleByUserIdUseCase).singleton(),
    getActiveClientRequestUseCase: asClass(GetActiveClientRequestUseCase).singleton(),
    createChatMessageUseCase: asClass(ChatMessageCreateUseCase).singleton(),
    chatUseCases: asClass(ChatUseCases).singleton(),
    clientRequestUseCases: asClass(ClientRequestUseCases).singleton(),
    createClientRequestUseCase: asClass(CreateClientRequestUseCase).singleton(),
    getNearbyTripRequestUseCase: asClass(GetNearbyTripRequestUseCase).singleton(),
    updateDriverAssignedUseCase: asClass(UpdateDriverAssignedUseCase).singleton(),
    getClientRequestByIdUseCase: asClass(GetClientRequestByIdUseCase).singleton(),
    updateStatusUseCase: asClass(UpdateStatusUseCase).singleton(),
    updateDriverRatingUseCase: asClass(UpdateDriverRatingUseCase).singleton(),
    updateClientRatingUseCase: asClass(UpdateClientRatingUseCase).singleton(),
    getByClientAssignedUseCase: asClass(GetByClientAssignedUseCase).singleton(),
    getByDriverAssignedUseCase: asClass(GetByDriverAssignedUseCase).singleton(),
    updateUserUseCase: asClass(UpdateUserUseCase).singleton(),
    updateImageUserUseCase: asClass(UpdateImageUserUseCase).singleton(),
    userUseCases: asClass(UserUseCases).singleton(),
    updateNotificationTokenUseCase: asClass(UpdateNotificationTokenUseCase).singleton(),
    driverPositionUseCases: asClass(DriverPositionUseCases).singleton(),
    createDriverPositionUseCase: asClass(CreateDriverPositionUseCase).singleton(),
    getDriverPositionUseCase: asClass(GetDriverPositionUseCase).singleton(),
    driverTripOfferUseCases: asClass(DriverTripOfferUseCases).singleton(),
    createDriverTripOfferUseCase: asClass(CreateDriverTripOfferUseCase).singleton(),
    getDriverTripOffersUseCase: asClass(GetDriverTripOffersUseCase).singleton(),
    createBalanceUseCase: asClass(CreateBalanceUseCase).singleton(),
    updateBalanceUseCase: asClass(UpdateBalanceUseCase).singleton(),
    balanceUseCases: asClass(BalanceUseCases).singleton(),
    loginViewModel: asClass(LoginViewModel).singleton(),
    registerViewModel: asClass(RegisterViewModel).inject(() => ({
        authUseCases: container.resolve('authUseCases'),
        balanceUseCase: container.resolve('balanceUseCases'),
    })).singleton(),
    clientSearchMapViewModel: asClass(ClientSerchMapViewModel).singleton(),
    driverMyLocationMapViewModel: asClass(DriverMyLocationMapViewModel).singleton(),
    profileUpdateViewModel: asClass(ProfileUpdateViewModel).singleton(),
    driverClientRequestViewModel: asClass(DriverClientRequestViewModel).singleton(),
    clientTripMapViewModel: asClass(ClientTripMapViewModel).singleton(),
    driverTripMapViewModel: asClass(DriverTripMapViewModel).singleton(),
    driverTripRatingViewModel: asClass(DriverTripRatingViewModel).singleton(),
    clientTripRatingViewModel: asClass(ClientTripRatingViewModel).singleton(),
    clientTripHistoryViewModel: asClass(ClientTripHistoryViewModel).singleton(),
    driverTripHistoryViewModel: asClass(DriverTripHistoryViewModel).singleton(),
    vehicleRegisterViewModel: asClass(VehicleRegisterViewModel).singleton(),
    documentsViewModel: asClass(DocumentsViewModel).singleton(),
    chatViewModel: asClass(ChatViewModel).singleton(),
    balanceViewModel: asClass(BalanceViewModel).singleton()
});

export { container };