# Error Code
1st Digit: Category
2nd Digit: Sub-Category
3rd Digit: backend:[0-4], frontend:[5-9]


# 1000 Series: Authentication
1101  Login: fail to login user (unknown reason, this error should NEVER occur)
1102  Login: account is suspended
1151  Login: Network Connection Issue
1152  Login: account is suspended

1201  Register: email or username already exist
1202  Register: Passport issue when register new user
1203  Register: Passport fails to login newly registered user
1204  Register: Error (should never occurs)
1251  Register: Registration Fails (front-end unknown error)
1252  Register: Network Connection Issue
1253  Register: mobile number invalid format


1301  ConfirmPasswordReset: fail to setPassword
1302  ConfirmPasswordReset: fail to foundUser.save() 
1303  ConfirmPasswordReset: hash not valid or expire
1304  ConfirmPasswordReset: Database connection issue
1351  ConfirmPasswordReset: back-end error
1452  ConfirmPasswordReset: unknown

1401  RequestPasswordReset: Fail to save passwordResetHash
1402  RequestPasswordReset: Fail to send email
1403  RequestPasswordReset: General Error: Highly Likely: username does not exists
1451  RequestPasswordReset: back-end error
1452  RequestPasswordReset: unknown error

1551  CheckSession: Network Connection Issue
1552  CheckSession: authentication error

1601  Logout: passport error
1651  Logout: Failure, non-200 status 
1652  Logout: Network Connection Issue

2111  InventoryPopulate: cannot access database
2151  InventoryPopulate: Network Connection Issue
2152  InventoryPopulate: back-end JSON error

2211  InventoryAdd: item has different owner while updating
2212  InventoryAdd: NOT allow to change Part Number while updating
2213  InventoryAdd: Fail to update database
2251  InventoryAdd: Network Connection
2252  InventoryAdd: back-end JSON error
