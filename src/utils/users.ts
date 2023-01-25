const mergeUserData = (firebaseUser: any, mongoUser: any) => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  phoneNumber: firebaseUser.phoneNumber,
  disabled: firebaseUser.disabled,
  type: mongoUser.type,
  firstName: mongoUser.firstName,
  lastName: mongoUser.lastName,
  address1: mongoUser.address1,
  address2: mongoUser.address2,
  city: mongoUser.city,
  state: mongoUser.state,
  zip: mongoUser.zip,
  accessLvls: mongoUser.accessLvls,
  notes: mongoUser.notes,
  creationTime: firebaseUser.metadata.creationTime,
  lastSignInTime: firebaseUser.metadata.lastSignInTime,
  lastRefreshTime: firebaseUser.metadata.lastRefreshTime,
})

export default mergeUserData
