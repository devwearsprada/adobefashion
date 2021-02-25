'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */
function makeTitle(slug) {
  var words = slug.split('-');
  words.forEach((word, index) => {
    words[index] = word.charAt(0).toUpperCase() + word.slice(1)
  })
  words = words.slice(0, -1).join(' ') + '-' + words.slice(-1);
  return words
}


module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const id = data.original
      const original = await strapi.query('original').findOne({ id })
      // check if we already got our first edit
      const edit = await strapi.query('edit').find({ slug: `${original.slug}-1` })

      // set title to its original title so we can generate an unique slug
      data.title = original.title

      // check if there is already an edit for this look
      if (edit.length >= 1) {
        // there is already an edit for this look
        const lookTitle = await strapi.plugins['content-manager'].services.uid.generateUIDField({
          contentTypeUID: 'application::edit.edit',
          field: 'slug',
          data: data
        })
        // set slug to our uniquely generated slug
        data.slug = lookTitle
      } else {
        // there is no edit for this look. create the first one
        data.slug = `${original.slug}-1`
      }

      // generate new title from uniquely generated slug
      data.title = makeTitle(data.slug)
    }
  }
};
