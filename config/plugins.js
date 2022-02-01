module.exports = ({env}) => ({
  email: {
      provider: 'sendinblue',
      providerOptions: {
          sendinblue_api_key: env('SIB_API_KEY', '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'),
          sendinblue_default_replyto: env('SIB_DEFAULT_REPLY_TO', 'soporte@innovaciones.co'),
          sendinblue_default_from: env('SIB_DEFAULT_FROM', 'soporte@innovaciones.co'),
          sendinblue_default_from_name: env('SIB_DEFAULT_FROM_NAME', 'Promotora Metropolitana'),
      },
  },
});
