import { defineArrayMember, defineField, defineType } from 'sanity';

export const portfolioProject = defineType({
    name: 'portfolioProject',
    title: 'Progetto',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Titolo',
            type: 'string',
            validation: rule => rule.required()
        }),
        defineField({
            name: 'slug',
            title: 'Identificativo URL',
            type: 'slug',
            options: { source: 'title' },
            validation: rule => rule.required()
        }),
        defineField({
            name: 'category',
            title: 'Categoria',
            type: 'string'
        }),
        defineField({
            name: 'year',
            title: 'Anno',
            type: 'number',
            validation: rule => rule.integer()
        }),
        defineField({
            name: 'summary',
            title: 'Anteprima',
            type: 'text',
            rows: 2
        }),
        defineField({
            name: 'description',
            title: 'Descrizione',
            type: 'text'
        }),
        defineField({
            name: 'sortOrder',
            title: 'Posizione nel portfolio',
            description: 'I numeri più bassi compaiono per primi.',
            type: 'number',
            validation: rule => rule.integer()
        }),
        defineField({
            name: 'images',
            title: 'Immagini',
            description: 'La prima immagine viene usata come copertina.',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'image',
                    fields: [
                        defineField({ name: 'altText', title: 'Testo alternativo', type: 'string' }),
                        defineField({ name: 'caption', title: 'Didascalia', type: 'string' })
                    ]
                })
            ]
        })
    ],
    preview: {
        select: { title: 'title', subtitle: 'category', media: 'images.0' }
    }
});
