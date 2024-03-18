import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import {
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Booking = () => {
  const [bookRoomNumber, setbookRoomNumber] = useState(null);
  const [bookRoomCustomer, setbookRoomCustomer] = useState(null);
  const [cancelRoomNumber, setcancelRoomNumber] = useState(null);
  const [cancelRoomCustomer, setcancelRoomCustomer] = useState(null);
  const [availableRooms, setavailableRooms] = useState([]);
  const [loader, setLoading] = useState(false);

  const { contract } = useContract(
    "0x4f965cbe469f4057a70c81B6b2afFe54dd7A6255",
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      { inputs: [], name: "insufficientFunds", type: "error" },
      { inputs: [], name: "invalidRoom", type: "error" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "roomNumber",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "guest",
            type: "address",
          },
        ],
        name: "RoomBooked",
        type: "event",
      },
      {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "availableRooms",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "roomNumber", type: "uint256" },
          { internalType: "address", name: "customer", type: "address" },
        ],
        name: "bookRoom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "", type: "uint256" },
          { internalType: "address", name: "", type: "address" },
        ],
        name: "bookedRooms",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint256", name: "roomNumber", type: "uint256" },
          { internalType: "address", name: "customer", type: "address" },
        ],
        name: "cancelBooking",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getAvailableRooms",
        outputs: [
          { internalType: "uint256[10]", name: "", type: "uint256[10]" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "numRooms",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "roomPrice",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "withdrawFunds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      { stateMutability: "payable", type: "receive" },
    ]
  );
  const {
    data: availableRoomsData,
    isLoading: ARLoading,
    error: ARError,
  } = useContractRead(contract, "getAvailableRooms");
  const {
    data: hotelbalanceData,
    isLoading: HBLoading,
    error: HBError,
  } = useContractRead(contract, "getBalance");

  const {
    mutateAsync: bookRoomFunc,
    isLoading: BRLoading,
    error: BRError,
  } = useContractWrite(contract, "bookRoom");

  const {
    mutateAsync: cancelBookingFunc,
    isLoading: CBLoading,
    error: CBError,
  } = useContractWrite(contract, "cancelBooking");

  const {
    mutateAsync: withdrawBalanceFunc,
    isLoading: WBLoading,
    error: WBError,
  } = useContractWrite(contract, "withdrawFunds");

  const handleBooking = (e) => {
    e.preventDefault();
    setLoading(true);
    bookRoomFunc?.({
      args: [Number(`${bookRoomNumber}`), bookRoomCustomer],
      overrides: {
        value: parseUnits("0.0005", "ether"),
      },
    })
      .then((data) => {
        if (data.receipt) {
          toast.success("successfully booked");
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const handleCancelBooking = (e) => {
    e.preventDefault();
    setLoading(true);
    cancelBookingFunc?.({
      args: [Number(`${cancelRoomNumber}`), cancelRoomCustomer],
    })
      .then((data) => {
        if (data.receipt) {
          toast.success("successfully cancelled booking");
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleWithdraw = () => {};
  const handleGetBalance = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(Number(`${bookRoomNumber}`), bookRoomCustomer);
    console.log(availableRoomsData);
  }, [availableRoomsData]);

  useEffect(() => {
    // console.log(formatEther(Number(hotelbalanceData)));
  }, [hotelbalanceData]);
  return (
    <div className="w-fit mx-auto mb-8">
      {loader ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Book a room</h2>
            <div>
              <form action="" onSubmit={handleBooking}>
                <div className="flex justify-between items-center gap-x-3 my-4">
                  <div>
                    <p className="mb-2 font-semibold">Room number</p>
                    <input
                      type="text"
                      placeholder="room number"
                      className="bg-gray-100 py-2 px-1 text-black"
                      onChange={(e) => setbookRoomNumber(e.target.value)}
                      name="number"
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-semibold">Address</p>
                    <input
                      type="text"
                      placeholder="customer address"
                      className="bg-gray-100 py-2 px-1 text-black"
                      onChange={(e) => setbookRoomCustomer(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-blue-500 py-2 font-semibold rounded-sm text-white"
                  type="submit"
                >
                  Book room
                </button>
              </form>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">Available rooms</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-3 max-w-md">
              {availableRoomsData
                ? availableRoomsData.map((item, index) =>
                    Number(item) == 0 ? (
                      ""
                    ) : (
                      <div
                        key={index}
                        className="bg-yellow-400 w-14 text-center py-2 text-white"
                      >
                        {`${item}`}
                      </div>
                    )
                  )
                : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                    <div key={index} className="bg-gray-100 p-4">
                      {item}
                    </div>
                  ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-4">Cancel Booking</h2>
            <div>
              <form action="" onSubmit={handleCancelBooking}>
                <div className="flex justify-between items-center gap-x-3 my-4">
                  <div>
                    <p className="mb-2 font-semibold">Room number</p>
                    <input
                      type="text"
                      placeholder="room number"
                      className="bg-gray-100 py-2 px-1 text-black"
                      onChange={(e) => setcancelRoomNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-semibold">Address</p>
                    <input
                      type="text"
                      placeholder="customer address"
                      className="bg-gray-100 py-2 px-1 text-black"
                      onChange={(e) => setcancelRoomCustomer(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-blue-500 py-2 font-semibold rounded-sm text-white"
                  type="submit"
                >
                  Cancel Booking
                </button>
              </form>
            </div>
          </div>
          <div className="flex justify-center items-center mb-6">
            <button
              className="bg-yellow-500 py-2 px-3 rounded-md text-white"
              onClick={() =>
                withdrawBalanceFunc?.({
                  args: [],
                })
                  .then((data) => {
                    if (data.receipt) {
                      toast.success("successfully withdrawn balance");
                      setLoading(false);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                    setLoading(false);
                  })
              }
            >
              Withdraw Funds
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Balance:{" "}
              <span className="text-red-500">
                {hotelbalanceData ? formatEther(Number(hotelbalanceData)) : "0"}
                ETH
              </span>
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;
