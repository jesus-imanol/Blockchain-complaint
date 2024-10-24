# Traffic light contract

To compile the contract yo need yo enter in 'wasm' and then put:

cargo build --release

## Architecture

A contract consists of two directories:
-	App: Where lives all business logic.
-	Wasm: Where the contract is built and the IDL is generated 

## Walletless feature

This contract contains the signless and walletless feature, it use the keyring service as an extra service, you can find it in the repository: [keyring-service repository](https://github.com/Vara-Lab/Contracts-Services/tree/main/keyring-service)

### Services

- TrafficLightService:

    This service contains the logic to implement a traffic light.

- KeyringService:

    This service comes from the [KeyringService](https://github.com/Vara-Lab/Contracts-Services/tree/main/keyring-service) repository, to use it, you just have to put it as another service in the program (This contract already implement it):

    ```rust
    // code ...

    #[derive(Default)]
    pub struct Porgram;

    #[program]
    impl Program {
        #[route("KeyringService")]
        pub fn keyring_svc(&self) -> KeyringService {
            KeyringService::new()
        }

        // code ...
    }
    ```