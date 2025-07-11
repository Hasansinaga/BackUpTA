import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dairytrack_mobile/controller/APIURL2/providers/productTypeProvider.dart';
import 'package:dairytrack_mobile/controller/APIURL2/providers/productStockProvider.dart';
import 'package:dairytrack_mobile/controller/APIURL2/utils/authutils.dart';
import 'package:intl/intl.dart';
import 'package:logger/logger.dart';
import 'package:dairytrack_mobile/views/salesAndFinancialManagement/component/actionButtons.dart';
import 'package:dairytrack_mobile/views/salesAndFinancialManagement/component/dateTimePickerField.dart';
import 'package:dairytrack_mobile/views/salesAndFinancialManagement/component/customSnackbar.dart';

class CreateStockBottomSheet extends StatefulWidget {
  const CreateStockBottomSheet({Key? key}) : super(key: key);

  @override
  _CreateStockBottomSheetState createState() => _CreateStockBottomSheetState();
}

class _CreateStockBottomSheetState extends State<CreateStockBottomSheet> {
  final _formKey = GlobalKey<FormState>();
  int? _selectedProductType;
  final _initialQuantityController = TextEditingController();
  final _totalMilkUsedController = TextEditingController();
  final _productionDateController = TextEditingController();
  final _expiryDateController = TextEditingController();
  DateTime? _productionDate;
  DateTime? _expiryDate;
  String? _status = 'available';
  final _logger = Logger();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final productTypeProvider =
          Provider.of<ProductTypeProvider>(context, listen: false);
      if (!productTypeProvider.isLoading &&
          productTypeProvider.productTypes.isEmpty) {
        productTypeProvider.fetchProductTypes();
      }
    });
  }

  Future<void> _selectDateTime(BuildContext context, bool isProduction) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (pickedDate != null) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );

      if (pickedTime != null) {
        final DateTime combinedDateTime = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );

        setState(() {
          if (isProduction) {
            _productionDate = combinedDateTime;
            _productionDateController.text =
                DateFormat('dd MMM yyyy HH:mm').format(combinedDateTime);
          } else {
            _expiryDate = combinedDateTime;
            _expiryDateController.text =
                DateFormat('dd MMM yyyy HH:mm').format(combinedDateTime);
          }
        });
      }
    }
  }

  Future<void> _submitForm(StockProvider provider) async {
    if (_formKey.currentState!.validate() &&
        _selectedProductType != null &&
        _productionDate != null &&
        _expiryDate != null) {
      try {
        final userId = await AuthUtils.getUserId();
        final newStock = {
          'productType': _selectedProductType,
          'initialQuantity': int.parse(_initialQuantityController.text),
          'productionAt': DateTime.utc(
            _productionDate!.year,
            _productionDate!.month,
            _productionDate!.day,
            _productionDate!.hour,
            _productionDate!.minute,
          ).toIso8601String(),
          'expiryAt': DateTime.utc(
            _expiryDate!.year,
            _expiryDate!.month,
            _expiryDate!.day,
            _expiryDate!.hour,
            _expiryDate!.minute,
          ).toIso8601String(),
          'status': _status,
          'totalMilkUsed': double.parse(_totalMilkUsedController.text),
          'createdBy': userId,
        };

        _logger.i('Submitting stock: $newStock');

        final success = await provider.createStock(newStock);
        if (success) {
          Navigator.pop(context);
          provider.fetchStocks();
          CustomSnackbar.show(
            context: context,
            message: 'Product stock added successfully',
            backgroundColor: Colors.green,
            icon: Icons.check_circle,
            iconColor: Colors.white,
          );
        } else {
          _logger.e('Failed to create stock: ${provider.errorMessage}');
          CustomSnackbar.show(
            context: context,
            message: 'Failed to add stock: ${provider.errorMessage}',
            backgroundColor: Colors.red,
            icon: Icons.error,
            iconColor: Colors.white,
          );
        }
      } catch (e) {
        _logger.e('Error submitting stock: $e');
        CustomSnackbar.show(
          context: context,
          message: 'Failed to add product stock: $e',
          backgroundColor: Colors.red,
          icon: Icons.error,
          iconColor: Colors.white,
        );
      }
    } else {
      _logger.w('Form validation failed or required fields missing');
      CustomSnackbar.show(
        context: context,
        message: 'Please fill in all required fields',
        backgroundColor: Colors.orange,
        icon: Icons.warning,
        iconColor: Colors.white,
      );
    }
  }

  @override
  void dispose() {
    _initialQuantityController.dispose();
    _totalMilkUsedController.dispose();
    _productionDateController.dispose();
    _expiryDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductTypeProvider>(
      builder: (context, productTypeProvider, child) {
        return Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            left: 16,
            right: 16,
            top: 16,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Add Product Stock',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Flexible(
                child: SingleChildScrollView(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (productTypeProvider.isLoading)
                          const Center(child: CircularProgressIndicator())
                        else if (productTypeProvider.errorMessage.isNotEmpty)
                          Text(
                            productTypeProvider.errorMessage,
                            style: const TextStyle(color: Colors.red),
                          )
                        else
                          DropdownButtonFormField<int>(
                            decoration: const InputDecoration(
                              labelText: 'Product Type',
                              border: OutlineInputBorder(),
                            ),
                            items: productTypeProvider.productTypes
                                .map((product) => DropdownMenuItem<int>(
                                      value: product.id,
                                      child: Text(product.productName),
                                    ))
                                .toList(),
                            value: _selectedProductType,
                            onChanged: (value) {
                              setState(() {
                                _selectedProductType = value;
                              });
                            },
                            validator: (value) {
                              if (value == null) {
                                return 'Product type is required';
                              }
                              return null;
                            },
                          ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _initialQuantityController,
                          decoration: const InputDecoration(
                            labelText: 'Initial Quantity',
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Initial quantity cannot be empty';
                            }
                            if (int.tryParse(value) == null) {
                              return 'Quantity must be a number';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: _totalMilkUsedController,
                          decoration: const InputDecoration(
                            labelText: 'Total Milk Used (liters)',
                            border: OutlineInputBorder(),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Total milk used cannot be empty';
                            }
                            if (double.tryParse(value) == null) {
                              return 'Total milk must be a number';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<String>(
                          decoration: const InputDecoration(
                            labelText: 'Status',
                            border: OutlineInputBorder(),
                          ),
                          items: const [
                            DropdownMenuItem(
                                value: 'available', child: Text('Available')),
                            DropdownMenuItem(
                                value: 'contamination', child: Text('Contaminated')),
                            DropdownMenuItem(
                                value: 'expired', child: Text('Expired')),
                          ],
                          value: _status,
                          onChanged: (value) {
                            setState(() {
                              _status = value;
                            });
                          },
                          validator: (value) {
                            if (value == null) {
                              return 'Status is required';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 12),
                        DateTimePickerField(
                          controller: _productionDateController,
                          labelText: 'Production Date & Time',
                          initialDate: _productionDate,
                          onTap: () => _selectDateTime(context, true),
                        ),
                        const SizedBox(height: 12),
                        DateTimePickerField(
                          controller: _expiryDateController,
                          labelText: 'Expiry Date & Time',
                          initialDate: _expiryDate,
                          onTap: () => _selectDateTime(context, false),
                        ),
                        const SizedBox(height: 16),
                        Consumer<StockProvider>(
                          builder: (context, stockProvider, child) {
                            return ActionButtons(
                              isLoading: stockProvider.isLoading,
                              onSubmit: () => _submitForm(stockProvider),
                              submitText: 'Add',
                              submitColor: Colors.blueGrey[800]!,
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}