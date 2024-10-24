Secret Event - Project
Rust- 1.83.0

Vara Contract 
Step 2: Compile and Deploy the Smart Contract
Rust: You need to have rust 1.80 or newer to be able to compile your contract:
rustup install 1.81
rustup default 1.81
rustup target add wasm32-unknown-unknown
Compile the smart contract by running the following command:
cargo build --release
Once the compilation is complete, locate the *.opt.wasm file in the target/wasm32-unknown-unknown/release directory.







