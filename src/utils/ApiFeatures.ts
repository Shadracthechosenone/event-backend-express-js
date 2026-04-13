class ApiFeatures {
  private queryOptions: any;
  private queryString: Record<string, any>;

  constructor(queryString: Record<string, any>) {
    this.queryOptions = {};
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "searchQuery"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filters: Record<string, any> = {};

    // Recherche par nom d'event
    if (this.queryString.searchQuery) {
      filters.name = {
        contains: this.queryString.searchQuery,
        mode: "insensitive",
      };
    }

    // Filtre par catégorie (via le nom puisque EventCategories n'a pas de slug)
    if (this.queryString.categoryName) {
      filters.EventCategories = {
        is: {
          name: {
            equals: this.queryString.categoryName,
            mode: "insensitive",
          },
        },
      };
      delete queryObj["categoryName"];
    }

    // Filtre par status (ACTIVE, INACTIVE, etc.)
    if (this.queryString.status) {
      filters.status = this.queryString.status.toUpperCase();
      delete queryObj["status"];
    }

    // Filtre par favori
    if (this.queryString.favory) {
      filters.favory = this.queryString.favory.toLowerCase() === "true";
      delete queryObj["favory"];
    }

    // Filtre par userId (events d'un utilisateur spécifique)
    if (this.queryString.userId) {
      filters.userId = parseInt(this.queryString.userId);
      delete queryObj["userId"];
    }

    // Filtre par date de début (events à venir)
    if (this.queryString.upcoming) {
      filters.startAt = { gt: new Date() };
      delete queryObj["upcoming"];
    }

    // Filtre par plage de dates
    if (this.queryString.startFrom) {
      filters.startAt = {
        ...filters.startAt,
        gte: new Date(this.queryString.startFrom),
      };
      delete queryObj["startFrom"];
    }

    if (this.queryString.startTo) {
      filters.startAt = {
        ...filters.startAt,
        lte: new Date(this.queryString.startTo),
      };
      delete queryObj["startTo"];
    }

    this.queryOptions.where = filters;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").map((field: string) => {
        const [key, order] = field.split(":");
        return { [key]: order || "asc" };
      });
      this.queryOptions.orderBy = sortBy;
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(",")
        .reduce((acc: any, field: string) => {
          acc[field] = true;
          return acc;
        }, {});
      this.queryOptions.select = fields;
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.take) || 10;
    const skip = Number(this.queryString.skip) || (page - 1) * limit;
    this.queryOptions.skip = skip;
    this.queryOptions.take = limit;
    this.queryOptions.page = page || { createdAt: "desc" };
    return this;
  }

  build() {
    return this.queryOptions;
  }
}

export default ApiFeatures;