async function paginateLists(params) {
  try {
    const { orderBy, sort, pageSize, lastId, dbRef, filteredDbRef } = params;

    let query = filteredDbRef;

    if (orderBy) {
      query = query.orderBy(String(orderBy), sort || "desc");
    }

    query = query.limit(Number(pageSize));

    if (lastId) {
      const lastDocument = await dbRef.doc(String(lastId)).get();
      if (!lastDocument.exists) {
        throw new Error("lastId_not_found");
      }
      query = query.startAfter(lastDocument);
    }

    const dbData = await query.get();

    const list = dbData.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    const nextPage = dbData.size === Number(pageSize);

    const response = { list, nextPage };

    if (list.length > 0) {
      const lastDocument = dbData.docs[dbData.docs.length - 1];
      response.lastId = lastDocument.id;
    }

    return response;
  } catch (error) {
    console.error("Pagination Error:", error);
    throw new Error(error.message || "pagination_failed");
  }
}

module.exports = paginateLists;
