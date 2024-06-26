import mongoose from "mongoose";
import "../models/schemaRegister.js";

const deleteQuery = async (modelName, condition, queryType = "default") => {
  try {
    const model = mongoose.model(modelName);
    let deleteResult;
    switch (queryType) {
      case "deleteOne":
        deleteResult = await model.deleteOne(condition);
        break;
      default:
        deleteResult = await model.deleteMany(condition);
        break;
    }
    return deleteResult;
  } catch (error) {
    console.error("Error in deleteQuery:", error);
    throw error;
  }
};

const insertQuery = async (modelName, data, queryType = "default") => {
  try {
    const model = mongoose.model(modelName);
    let insertResult;
    switch (queryType) {
      case "insertMany":
        insertResult = await model.insertMany(data);
        break;
      default:
        insertResult = await model.create(data);
        break;
    }
    return insertResult;
  } catch (error) {
    console.error("Error in insertQuery:", error);
    throw error;
  }
};

const distinctQuery = async (modelName, distinctName, where = {}) => {
  try {
    const model = mongoose.model(modelName);
    const distinctData = await model.distinct(distinctName, where);
    return distinctData;
  } catch (error) {
    console.error("Error in distinctQuery:", error);
    throw error;
  }
};

const findAll = async (
  modelName,
  where = {},
  select = {},
  populationFields = [],
  sort = {},
  limit = 0,
  skip = 0
) => {
  try {
    const model = mongoose.model(modelName);
    return await model
      .find(where, select)
      .populate(populationFields)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();
  } catch (error) {
    console.error("Error in findAll:", error);
    throw error;
  }
};

const findOne = async (
  modelName,
  where = {},
  select = {},
  populationFields = [],
  sort = {},
  limit = 0,
  skip = 0
) => {
  try {
    const model = mongoose.model(modelName); // Expect a model name string here
    return await model
      .findOne(where, select)
      .populate(populationFields)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();
  } catch (error) {
    console.error("Error in findOne:", error);
    throw error;
  }
};


const update = async (modelName, where, updateData, queryType = "default") => {
  try {
    const model = mongoose.model(modelName);
    let updateResult;
    switch (queryType) {
      case "updateOne":
        updateResult = await model.updateOne(where, updateData, { new: true });
        break;
      case "updateMany":
        updateResult = await model.updateMany(where, updateData, { new: true });
        break;
      default:
        updateResult = await model.findOneAndUpdate(where, updateData, {
          upsert: true,
          new: true,
        });
        break;
    }
    return updateResult;
  } catch (error) {
    console.error("Error in update:", error);
    throw error;
  }
};

const countRecords = async (modelName, condition = {}) => {
  try {
    const model = mongoose.model(modelName);
    return await model.countDocuments(condition);
  } catch (error) {
    console.error("Error in countRecords:", error);
    throw error;
  }
};

const findRaw = async (modelName, where = {}) => {
  try {
    const collection = mongoose.connection.collection(modelName);
    return await collection.find(where).toArray();
  } catch (error) {
    console.error("Error in findRaw:", error);
    throw error;
  }
};

const groupBy = async (modelName, where = {}, groupData = {}) => {
  try {
    const model = mongoose.model(modelName);
    return await model.aggregate([
      { $match: where },
      { $group: groupData },
    ]);
  } catch (error) {
    console.error("Error in groupBy:", error);
    throw error;
  }
};

const projectAggregate = async (modelName, lookup, project = {}, match = {}) => {
  try {
    const model = mongoose.model(modelName);
    return await model.aggregate([
      { $lookup: lookup },
      { $match: match },
      { $project: project },
    ]);
  } catch (error) {
    console.error("Error in projectAggregate:", error);
    throw error;
  }
};

export {
  deleteQuery,
  insertQuery,
  distinctQuery,
  findAll,
  findOne,
  update,
  countRecords,
  findRaw,
  groupBy,
  projectAggregate,
};
