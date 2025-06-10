import dharmacyRouter from "./api/controllers/dharmacy/router";
// import merchantRouter from "./api/controllers/merchant/router";

export default function routes(app) {
  app.use("/api/dharmacy", dharmacyRouter);
  // app.use("/api/diinfintech", merchantRouter);
}
