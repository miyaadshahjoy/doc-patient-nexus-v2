Q1: Create a database called clinicDB and add a collection named appointments. Insert 2 sample documents with patient name, doctor name, and appointment date.
A1: db.appointments.insertMany([
{patient: 'Waly Ul', doctor: 'Dr. Miyaad J', appointmentDate: ISODate('2025-03-15')},
{patient: 'Wasy Ul', doctor: 'Dr. Miyaad J', appointmentDate: ISODate('2025-03-10')}
])

Q2: Explain the difference between use clinicDB and db = db.getSiblingDB("clinicDB"). When would you use each?
A2: Don't know the answer.

Q3: In which situations would you create a separate collection instead of adding a new field to an existing document?
A3: When I have to store document for a different resource then I have to create a new collection

Q4: Create a BSON-style document that includes the following data types: String, Date, Boolean, Array, and ObjectId.

A4:
{
\_id: ObjectId('68141693dff3a458682710bc'),
name: 'Dr. Miyaad Joy',
appointementDate: ISODate('2025-05-10'),
available: true,
specialization: ['Cardiology', 'FCPS'],

}

Q5: What data type would you use to store:

A patient’s blood glucose level with high precision?

A future surgery date?

Whether a doctor is currently available?

A list of languages a doctor can speak?

A5: NumberDecimal, Date, Boolean, Array

Q6: Write a query to find all patients aged over 40.

A6: db.patients.find({age: {$gt: 40}})

Q7: Write a query to retrieve all doctors whose specialization includes "Cardiology".

A7: db.doctors.find({specialization: 'Cardiology'})

Q8: Use the $in operator to find all appointments with status either "pending" or "confirmed".

A8: db.appointments.find({status: {$in: ['pending', 'confirmed']}})

Q9: Write a query to fetch all patient documents but only include the name and phone fields.

A9: db.patients.find({},{name: 1, phone: 1, \_id: 0})

Q10: Sort all doctors by their years of experience in descending order.

A10: db.doctors.find().sort({experience: -1})

Q11: Retrieve all appointments and exclude the notes field from the result.

A11: db.appointments.find({},{notes: 0})

Q12: Write a query to retrieve the first 5 patients from the collection.

A12: db.patients.find().limit(5)

Q13: Retrieve the next 5 patients after skipping the first 5.

A13: db.patients.find().skip(5).limit(5)

Q14: How would you implement basic pagination for the appointments collection using skip and limit?

A14: db.appointments.find().skip(skip).limit(limit)
where, skip = (page - 1) \* limit,

Q15: Insert a new document into doctors with name, specialization, and years of experience.

A15: db.doctors.insertOne({name: 'Dr. Miyaad Joy', specialization: 'Cardiology', experience: 5})

Q16: Update the availability field of a doctor to true using their email.

A16: db.doctors.updateOne({email: 'miyaadj@gmail.com'}, {$set: {availability: true}})

Q17: Delete all patient records where active is false.

A17: db.patient.deleteMany({active: false})

Q18: Find and update a patient by their phone number to set emailVerified to true.

A18: db.patients.updateOne({phone: '01975111357'1}, {$set: {emailVerified: true}})

MCQ answers:

1. b
2. c
3. b
4. c
5. c
6. c
7. c
8. b
9. a
10. c
11. c
12. b
13. b
14. c
15. b
16. b
17. a
18. a
19. b
20. b
21. b
22. a
23. c
24. b
25. d
26. b
27. c
28. c
29. d
30. a

Q: Which query returns all doctors who are available and have more than 5 years of experience?
A: A

Q: Fill in the blank to find all patients whose bloodType is 'O+' and are active:
A: active, true

Q: Write a query to find all appointments where the status is "pending".
A: db.appointments.find({status: 'pending'})

Q: What does this query return?
A: A

Q: Write a query to return all patients older than 30 and living in "Dhaka".
A: db.patients.find({address: 'Dhaka', age: {$gt: 30}})

Q: Which operator is used to check if a field is NOT equal to a value?
A: A

Q: Fill in the blank to find all doctors who are not available
A: false

Q: Write a query to find all patients whose email is not verified and active is false.
A: db.patients.find({emailVerified: false, active: false})

Q: What will this query return?
db.patients.find({ age: { $gte: 30, $lte: 40 } })
A: A

Q: Write a query to get all appointments scheduled after May 20, 2025.
A: db.appointments.find({appointmentDate: {$gt: ISODate('2025-05-20T12:00:00.000Z')}})

Q: Which operator would you use to find doctors whose specialization includes either "Surgery" or "Neurology"?
A: C

Q: Write a query to get all patients who are not from Sylhet.
A: db.patients.find({address: {$ne: 'Sylhet'}})

Q: Fill in the blank to find doctors who specialize in either ENT or Dermatology:
A: db.doctors.find({ specialization: { $in: ["ENT", "Dermatology"] } })

Q: Write a query using $or to find patients whose age is less than 25 OR active is false.
A: db.patients.find({$or: [{age: {$lt: 25}},{active: false}]})

Q: What will the following query return?
A: A

Q: Write a query to find all doctors who have both "Surgery" and "Orthopedics" in their specialization.
A: db.doctors.find({specialization: ['Surgery', 'Orthopedics']})

Q: Fill in the blank to find appointments that are either pending or cancelled:
A: db.appointments.find({ status: { $in: ["pending", "cancelled"] } })

Q: Which query gets all patients who are either from "Rajshahi" or "Khulna"?
A: A

Q: Find all doctors with exactly 10 years of experience.
A: db.doctors.find({experience: 10})

Q: Fill in the blank to find patients whose age is NOT less than 30:
A: db.patients.find({ age: { $not: { $lt: 30 } } })

1. db.patients.updateMany({address: 'Khulna'},{$set: {address: 'Jessore'}})
2. db.doctors.updateMany({experience: {$lt: 3}}, {$set: {availability: false}})
3. db.doctors.updateMany({specialization: {$in: ['Medicine']}}, { $push: { specialization: 'Urology'}})
4. db.appointments.updateMany({status: 'cancelled'}, {$unset: {notes: ''}})
5. db.doctors.updateMany({experience: {$gt: 10}}, {$inc: {experience: 1}})
6. db.patients.updateMany({}, {$set: {lastUpdatedAt: new Date()}})
7. db.appointments.updateMany({status: 'pending'}, {$push: {tags: 'urgent'}})
8. db.doctors.updateMany({}, {$pull: {specialization: 'ENT'}})
9. db.patients.deleteMany({active: false, address: 'Barisal'})
10. db.appointments.deleteOne({status: 'cancelled', appointmentDate: {$lt: ISODate('2025-05-01')}})
11. db.doctors.deleteMany({specialization: {$exists: false}})
12. db.appointments.deleteMany({})
13. db.patients.createIndex({email: 1})
14. db.patients.createIndex({address: 1, age: -1})
15. db.doctors.createIndex({name: 'text', specialization: 'text'})
16. db.patients.find().hint({address: 1})
17. db.doctors.find({specialization: {$in: ['Medicine']}}).explain('executionStats')
18. db.patients.find({age: {$gt: 25}}).explain('executionStats')
19. db.doctors.find({availability: true}, {name: 1, specialization: 1, \_id: 0})
20. db.appointments.find({status: 'confirmed', appointmentDate: {$gte: ISODate('2025-01-01')}}, {\_id: 0, status: 0, notes: 0})


