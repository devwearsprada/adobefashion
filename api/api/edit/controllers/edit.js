'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async totalEntries(ctx) {
    const length = await strapi.query('edit').count();
    return length
  },
};