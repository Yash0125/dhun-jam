import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import axios from "axios";

const AdminDashboard = ({ token }) => {
  const [adminData, setAdminData] = useState({});
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState([0, 0, 0, 0]);
  const [isChargingCustomers, setIsChargingCustomers] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get(
          `https://stg.dhunjam.in/account/admin/4`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          const { amount, charge_customers } = response.data.data;
          setAdminData(response.data.data);
          setCustomAmount(amount.category_6);
          setRegularAmounts([
            amount.category_7,
            amount.category_8,
            amount.category_9,
            amount.category_10,
          ]);
          setIsChargingCustomers(charge_customers);
          console.log(adminData);
        } else {
          // Handle error
          console.log("error in fetchAdminDetails");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdminDetails();
  }, [token]);

  const handleCustomAmountChange = (value) => {
    setCustomAmount(value);
    setIsSaveButtonEnabled(value > 99);
  };

  const handleRegularAmountChange = (index, value) => {
    const newRegularAmounts = [...regularAmounts];
    newRegularAmounts[index] = value;
    setRegularAmounts(newRegularAmounts);
    setIsSaveButtonEnabled(
      newRegularAmounts.every((amount) => amount > [79, 59, 39, 19][index])
    );
  };

  const handleChargeCustomersChange = (value) => {
    setIsChargingCustomers(value === "yes");
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://stg.dhunjam.in/account/admin/4`,
        {
          amount: {
            category_6: customAmount,
            category_7: regularAmounts[0],
            category_8: regularAmounts[1],
            category_9: regularAmounts[2],
            category_10: regularAmounts[3],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("respose", response);

      if (response.data.status === 200) {
        const { amount, charge_customers } = response.data.data;

        // Update state only after a successful response
        setAdminData({
          ...adminData,
          amount: {
            category_6: amount.category_6,
            category_7: amount.category_7,
            category_8: amount.category_8,
            category_9: amount.category_9,
            category_10: amount.category_10,
          },
          charge_customers,
        });

        // Update other states as needed
        setCustomAmount(amount.category_6);
        setRegularAmounts([
          amount.category_7,
          amount.category_8,
          amount.category_9,
          amount.category_10,
        ]);

        console.log("Updated Admin Data:", adminData);
      } else {
        // Handle error
        console.log("handlesave");
      }
    } catch (error) {
      // Handle network error
      console.log("handlesave", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <p>Social: {adminData.name}</p>
        <p>Location: {adminData.location}</p>
      </div>
      <div>
        <p>Charge customers for song requests:</p>
        <label>
          <input
            type="radio"
            value="yes"
            checked={isChargingCustomers}
            onChange={() => handleChargeCustomersChange("yes")}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            value="no"
            checked={!isChargingCustomers}
            onChange={() => handleChargeCustomersChange("no")}
          />
          No
        </label>
      </div>
      <div>
        <p>Custom song request amount:</p>
        <input
          type="number"
          value={customAmount}
          onChange={(e) =>
            handleCustomAmountChange(parseInt(e.target.value, 10))
          }
        />
        <p>Regular song request amounts:</p>
        {regularAmounts.map((amount, index) => (
          <input
            key={index}
            type="number"
            value={amount}
            onChange={(e) =>
              handleRegularAmountChange(index, parseInt(e.target.value, 10))
            }
          />
        ))}
      </div>

      <button onClick={handleSave} disabled={!isSaveButtonEnabled}>
        Save
      </button>
      {isChargingCustomers && (
        <div className="graph-container">
          <div className="bar-graph">
            {adminData &&
              adminData.amount &&
              Object.entries(adminData.amount).map(([key, value]) => (
                <div
                  key={key}
                  className="bar"
                  style={{ height: `${value / 5}px` }}
                >
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

// DJ@4
// Dhunjam@2023